import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInstallationClient } from '@/lib/github/githubApp';
import { getServiceRoleClient } from '@/lib/supabase/serviceRoleClient';
import { userHasProjectEdit } from '@/lib/permissions/githubAccess';

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
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request
        const body = await request.json();
        const { projectId, userId: targetUserId } = body;

        if (!projectId || !targetUserId) {
            return NextResponse.json({ error: 'Missing projectId or userId' }, { status: 400 });
        }

        // 3. Permission check: project-wide → require project.edit
        const hasEdit = await userHasProjectEdit(user.id, projectId, supabase);
        if (!hasEdit) {
            return NextResponse.json({ error: 'You do not have permission to invite collaborators to this project.' }, { status: 403 });
        }

        // 4. Fetch target user's github_username
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('github_username')
            .eq('id', targetUserId)
            .single();

        if (profileError || !profile || !profile.github_username) {
            return NextResponse.json({ error: 'User hasn\'t linked GitHub' }, { status: 400 });
        }

        const serviceClient = getServiceRoleClient();
        const { data: targetAuth, error: authErr } = await serviceClient.auth.admin.getUserById(targetUserId);
        if (authErr) {
            console.error('Failed to look up target user identities:', authErr);
            return NextResponse.json({ error: 'Failed to verify target user identity.' }, { status: 500 });
        }
        const hasGithubIdentity = targetAuth?.user?.identities?.some((i) => i.provider === 'github') ?? false;
        if (!hasGithubIdentity) {
            return NextResponse.json(
                { error: 'Target user has not verified their GitHub account via OAuth.' },
                { status: 400 },
            );
        }

        // 5. Fetch project's github_repo
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('github_repo')
            .eq('id', projectId)
            .single();

        if (projectError || !project || !project.github_repo) {
            return NextResponse.json({ error: 'No linked repo' }, { status: 400 });
        }

        const [owner, repo] = project.github_repo.split('/');
        const username = profile.github_username;

        // 6. Authenticate as GitHub App
        let octokit;
        try {
            octokit = await getInstallationClient(project.github_repo);
        } catch (authError) {
            console.error('GitHub auth error:', authError);
            return NextResponse.json({ error: 'Failed to connect to the GitHub repository.' }, { status: 500 });
        }

        // 7. Check if already a collaborator
        try {
            await octokit.request('GET /repos/{owner}/{repo}/collaborators/{username}', {
                owner,
                repo,
                username,
            });
            // If 204 No Content, they are already a collaborator
            return NextResponse.json({ status: 'already_collaborator' });
        } catch (checkError: any) {
            // A 404 indicates they are NOT a collaborator, which is what we want to proceed.
            if (checkError.status !== 404) {
                console.error('GitHub API error checking collaborator:', checkError);
                return NextResponse.json({ error: 'Failed to query GitHub collaborator status.' }, { status: 500 });
            }
        }

        // 8. Send invite
        try {
            await octokit.request('PUT /repos/{owner}/{repo}/collaborators/{username}', {
                owner,
                repo,
                username,
                permission: 'push',
            });
            return NextResponse.json({ status: 'invited' });
        } catch (inviteError: any) {
            console.error('GitHub API error sending invite:', inviteError);
            return NextResponse.json({ error: 'Failed to invite user to GitHub repository.' }, { status: 500 });
        }

    } catch (err: unknown) {
        console.error('Unexpected error in invite-collaborator route:', err);
        return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
    }
}
