import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInstallationClient } from '@/lib/github/githubApp';
import { resolveCallerRole } from '@/lib/services/projectMemberService';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

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

        // 5. Guard: caller is lead/manager?
        const callerRole = await resolveCallerRole(user.id, task.project_id, supabase);
        const roleName = callerRole?.name?.toLowerCase() || '';

        if (!roleName.includes('lead') && !roleName.includes('manager')) {
            return NextResponse.json(
                { error: 'You do not have permission to push tasks to GitHub for this project.' },
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

        // 9. Authenticate as GitHub App
        let octokit;
        try {
            octokit = await getInstallationClient(project.github_repo);
        } catch (authError) {
            console.error('GitHub auth error:', authError);
            // Unlock task
            await supabase.from('tasks').update({ github_push_pending_at: null }).eq('id', taskId);
            return NextResponse.json(
                { error: 'Failed to connect to the GitHub repository. Ensure the GitHub App is installed.' },
                { status: 500 },
            );
        }

        const [owner, repo] = project.github_repo.split('/');

        // 10. Create issue via octokit
        let issueData;
        try {
            const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
                owner,
                repo,
                title: task.name,
                body: task.description || 'No description provided.',
            });
            issueData = response.data;
        } catch (apiError) {
            console.error('GitHub API error:', apiError);
            // Unlock task
            await supabase.from('tasks').update({ github_push_pending_at: null }).eq('id', taskId);
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

    } catch (err: any) {
        console.error('Unexpected error in create-issue route:', err);
        return NextResponse.json(
            { error: 'An unexpected server error occurred.' },
            { status: 500 },
        );
    }
}
