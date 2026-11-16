import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getInstallationClient } from '@/lib/github/githubApp';
import { getUserOctokit } from '@/lib/github/userOctokit';
import { userCanActOnTaskIssue } from '@/lib/permissions/githubAccess';

export const runtime = 'nodejs';

const PUSH_LOCK_WINDOW_MS = 2 * 60_000;

interface PushLock {
    taskId: number | string;
    pendingAt: string;
}

// Best-effort cleanup must never release a newer request's lock.
async function clearLock(supabase: SupabaseClient, lock: PushLock): Promise<void> {
    try {
        const { error } = await supabase
            .from('tasks')
            .update({ github_push_pending_at: null })
            .eq('id', lock.taskId)
            .eq('github_push_pending_at', lock.pendingAt);
        if (error) console.error('Failed to clear GitHub push lock:', error);
    } catch (error) {
        console.error('Failed to clear GitHub push lock:', error);
    }
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    let lock: PushLock | null = null;

    try {

        // 1. Auth check
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'You must be logged in to act on tasks.' },
                { status: 401 },
            );
        }

        // 2. Parse request body
        const body = await request.json();
        const { taskId } = body;

        if (!taskId) {
            return NextResponse.json(
                { error: 'Missing taskId.' },
                { status: 400 },
            );
        }

        // 3. Fetch the task with project data (specifically github_repo)
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .select(`
                *,
                projects!inner (
                    id,
                    projectName,
                    github_repo
                )
            `)
            .eq('id', taskId)
            .single();

        // 4. Guard: task exists?
        if (taskError || !task) {
            return NextResponse.json(
                { error: 'Task not found.' },
                { status: 404 },
            );
        }

        const project = Array.isArray(task.projects) ? task.projects[0] : task.projects;

        if (!project) {
            return NextResponse.json(
                { error: 'Server error: project not retrieved.' },
                { status: 500 },
            );
        }

        // 5. Guard: caller is an assignee on the task or has project.edit
        const access = await userCanActOnTaskIssue(user.id, taskId, task.project_id, supabase);

        if (!access.allowed) {
            return NextResponse.json(
                { error: access.reason },
                { status: 403 },
            );
        }

        // 6. Guard: project has a linked repo?
        if (!project.github_repo) {
            return NextResponse.json(
                { error: 'Project does not have a linked repository.' },
                { status: 400 },
            );
        }

        // 7. Guard: task doesn't already have an issue number?
        if (task.github_issue_number) {
            return NextResponse.json(
                { error: 'Task is already linked to a GitHub issue.' },
                { status: 409 },
            );
        }

        // 8. Atomically claim an unlinked task with no active push.
        const now = new Date();
        const pendingAt = now.toISOString();
        const staleBefore = new Date(now.getTime() - PUSH_LOCK_WINDOW_MS).toISOString();
        const { data: lockedTasks, error: lockError } = await supabase
            .from('tasks')
            .update({ github_push_pending_at: pendingAt })
            .eq('id', taskId)
            .is('github_issue_number', null)
            .or(`github_push_pending_at.is.null,github_push_pending_at.lt.${staleBefore}`)
            .select('id');

        if (lockError) {
            console.error('Failed to lock task for pushing:', lockError);
            return NextResponse.json(
                { error: 'Failed to prepare task for pushing.' },
                { status: 500 },
            );
        }

        if (!lockedTasks?.length) {
            return NextResponse.json(
                { error: 'Task is already linked to a GitHub issue or a push is in progress.' },
                { status: 409 },
            );
        }

        lock = { taskId, pendingAt };

        // 9. Authenticate as GitHub App
        let octokit;
        try {
            octokit = (await getUserOctokit(user.id)) ?? (await getInstallationClient(project.github_repo));
        } catch (authError) {
            console.error('GitHub auth error:', authError);
            // Unlock task
            await clearLock(supabase, lock);
            lock = null;
            return NextResponse.json(
                { error: 'Failed to connect to the GitHub repository. Ensure the GitHub App is installed.' },
                { status: 500 },
            );
        }

        const [owner, repo] = project.github_repo.split('/');

        const { data: assignmentRows } = await supabase
            .from('task_assignments')
            .select('profiles!inner(github_username)')
            .eq('task_id', taskId);
        const assignees = ((assignmentRows ?? []) as Array<{ profiles: { github_username: string | null } | { github_username: string | null }[] | null }>)
            .flatMap((r) => (Array.isArray(r.profiles) ? r.profiles : r.profiles ? [r.profiles] : []))
            .map((p) => p.github_username)
            .filter((u): u is string => !!u);

        // 10. Create issue via octokit
        let issueData;
        try {
            const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
                owner,
                repo,
                title: task.name,
                body: task.description || 'No description provided.',
                assignees,
            });
            issueData = response.data;
        } catch (apiError) {
            console.error('GitHub API error:', apiError);
            // Unlock task
            await clearLock(supabase, lock);
            lock = null;
            return NextResponse.json(
                { error: 'Failed to create GitHub issue.' },
                { status: 500 },
            );
        }

        const applied = (issueData.assignees ?? []).map((a: { login: string }) => a.login.toLowerCase());
        const dropped = assignees.map((a) => a.toLowerCase()).filter((a) => !applied.includes(a));
        if (dropped.length > 0) {
            console.warn(`[create-issue] task=${taskId} repo=${project.github_repo} requested=${JSON.stringify(assignees)} applied=${JSON.stringify(applied)} dropped=${JSON.stringify(dropped)} (likely not repo collaborators — invite them via the portal)`);
        }

        // 11. Update the task
        const { error: updateError } = await supabase
            .from('tasks')
            .update({
                github_issue_number: issueData.number,
                github_issue_url: issueData.html_url,
                github_push_pending_at: null,
            })
            .eq('id', taskId);

        if (updateError) {
            console.error('Failed to update task with GitHub issue info:', updateError);
            await clearLock(supabase, lock);
            lock = null;
            return NextResponse.json(
                { error: 'Issue created on GitHub, but failed to link it to the task.' },
                { status: 500 },
            );
        }

        // Successful update cleared the lock as part of the same row.
        lock = null;

        // 12. Log to activity_log (ignore errors to not block the main flow)
        supabase.from('activity_log').insert({
            user_id: user.id,
            action: `Pushed task "${task.name}" to GitHub issue #${issueData.number}`,
            project_id: task.project_id,
            task_id: taskId,
        }).then(({ error }) => {
            if (error) console.error('Failed to insert activity_log:', error);
        });

        // 13. Return successes
        return NextResponse.json({
            issueNumber: issueData.number,
            issueUrl: issueData.html_url,
        });

    } catch (err: unknown) {
        console.error('Unexpected error in create-issue route:', err);
        if (lock !== null) {
            await clearLock(supabase, lock);
        }
        return NextResponse.json(
            { error: 'An unexpected server error occurred.' },
            { status: 500 },
        );
    }
}
