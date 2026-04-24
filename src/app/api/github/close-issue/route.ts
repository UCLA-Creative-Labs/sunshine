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

        // 5. Guard: caller is lead/manager/edit? Since delete is allowed for editors.
        // Actually, resolveCallerRole is the strict check we do for GitHub pushes. Let's just use it.
        const callerRole = await resolveCallerRole(user.id, task.project_id, supabase);
        const roleName = callerRole?.name?.toLowerCase() || '';

        if (!roleName.includes('lead') && !roleName.includes('manager')) {
            return NextResponse.json(
                { error: 'You do not have permission to modify GitHub issues for this project.' },
                { status: 403 },
            );
        }

        // 6. Guard: project has a linked repo AND task has an issue
        if (!project.github_repo || !task.github_issue_number) {
            return NextResponse.json(
                { error: 'Project does not have a linked repository or task has no issue.' },
                { status: 400 },
            );
        }

        // 7. Authenticate as GitHub App
        let octokit;
        try {
            octokit = await getInstallationClient(project.github_repo);
        } catch (authError) {
            console.error('GitHub auth error:', authError);
            return NextResponse.json(
                { error: 'Failed to connect to the GitHub repository. Ensure the GitHub App is installed.' },
                { status: 500 },
            );
        }

        const [owner, repo] = project.github_repo.split('/');

        // 8. Close issue via octokit
        try {
            await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
                owner,
                repo,
                issue_number: task.github_issue_number,
                state: 'closed',
            });
        } catch (apiError) {
            console.error('GitHub API error:', apiError);
            return NextResponse.json(
                { error: 'Failed to close GitHub issue.' },
                { status: 500 },
            );
        }

        // 9. Log to activity_log
        supabase.from('activity_log').insert({
            user_id: user.id,
            action: `Closed GitHub issue #${task.github_issue_number} for task "${task.name}"`,
            project_id: task.project_id,
            task_id: taskId,
        }).then(({ error }) => {
            if (error) console.error('Failed to insert activity_log:', error);
        });

        // 10. Return successes
        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Unexpected error in close-issue route:', err);
        return NextResponse.json(
            { error: 'An unexpected server error occurred.' },
            { status: 500 },
        );
    }
}
