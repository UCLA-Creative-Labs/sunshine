import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { getInstallationClient } from '@/lib/github/githubApp';
import { getUserOctokit } from '@/lib/github/userOctokit';
import { userCanActOnTaskIssue } from '@/lib/permissions/githubAccess';

export const runtime = 'nodejs';

// Best-effort: clear the github_push_pending_at lock on a task. Errors are swallowed.
async function clearLock(supabase: SupabaseClient, taskId: number | string): Promise<void> {
    try {
        await supabase
            .from('tasks')
            .update({ github_push_pending_at: null })
            .eq('id', taskId);
    } catch {
        // Intentionally ignored — clearing the lock is best-effort.
    }
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    let lockedTaskId: number | string | null = null;

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

        // 8. Block multiple pushes
        const { error: lockError } = await supabase
            .from('tasks')
            .update({ github_push_pending_at: new Date().toISOString() })
            .eq('id', taskId);

        if (lockError) {
            console.error('Failed to lock task for pushing:', lockError);
            return NextResponse.json(
                { error: 'Failed to prepare task for pushing.' },
                { status: 500 },
            );
        }

        lockedTaskId = taskId;

        // 9. Authenticate as GitHub App
        let octokit;
        try {
            octokit = (await getUserOctokit(user.id)) ?? (await getInstallationClient(project.github_repo));
        } catch (authError) {
            console.error('GitHub auth error:', authError);
            // Unlock task
            await clearLock(supabase, taskId);
            lockedTaskId = null;
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
            await clearLock(supabase, taskId);
            lockedTaskId = null;
            return NextResponse.json(
                { error: 'Failed to create GitHub issue.' },
                { status: 500 },
            );
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
            // Issue was created, but task not updated. This is tricky.
            return NextResponse.json(
                { error: 'Issue created on GitHub, but failed to link it to the task.' },
                { status: 500 },
            );
        }

        // Successful update cleared the lock as part of the same row.
        lockedTaskId = null;

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
        if (lockedTaskId !== null) {
            await clearLock(supabase, lockedTaskId);
        }
        return NextResponse.json(
            { error: 'An unexpected server error occurred.' },
            { status: 500 },
        );
    }
}
