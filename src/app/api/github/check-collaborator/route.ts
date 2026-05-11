import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInstallationClient } from '@/lib/github/githubApp';
import { userHasProjectEdit } from '@/lib/permissions/githubAccess';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Auth check
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse query params
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const targetUserId = searchParams.get('userId');

        if (!projectId || !targetUserId) {
            return NextResponse.json({ error: 'Missing projectId or userId' }, { status: 400 });
        }

        // 3. Permission check: users may always check themselves; otherwise require project.edit.
        if (targetUserId !== user.id) {
            const hasEdit = await userHasProjectEdit(user.id, projectId, supabase);
            if (!hasEdit) {
                return NextResponse.json({ error: 'You do not have permission to check collaborator status for other users.' }, { status: 403 });
            }
        }

        // 4. Fetch target user's github_username
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('github_username')
            .eq('id', targetUserId)
            .single();

        if (profileError || !profile || !profile.github_username) {
            return NextResponse.json({ status: 'no_github_linked' });
        }

        // 5. Fetch project's github_repo
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('github_repo')
            .eq('id', projectId)
            .single();

        if (projectError || !project || !project.github_repo) {
            return NextResponse.json({ status: 'no_repo_linked' });
        }

        const [owner, repo] = project.github_repo.split('/');
        const username = profile.github_username;

        // 6. Authenticate as GitHub App
        let octokit;
        try {
            octokit = await getInstallationClient(project.github_repo);
        } catch (authError) {
            console.error('GitHub auth error:', authError);
            return NextResponse.json({ status: 'no_repo_linked' }); // Failure to get octokit can also map to gracefully resolving
        }

        // 7. Check if collaborator
        try {
            await octokit.request('GET /repos/{owner}/{repo}/collaborators/{username}', {
                owner,
                repo,
                username,
            });
            // If 204 No Content, they are already a collaborator
            return NextResponse.json({ status: 'collaborator' });
        } catch (checkError: any) {
            if (checkError.status === 404) {
                return NextResponse.json({ status: 'not_collaborator' });
            }
            console.error('GitHub API error checking collaborator:', checkError);
            return NextResponse.json({ error: 'Failed to query GitHub collaborator status.' }, { status: 500 });
        }

    } catch (err: unknown) {
        console.error('Unexpected error in check-collaborator route:', err);
        return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
    }
}
