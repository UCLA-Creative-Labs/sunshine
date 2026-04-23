import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

export const runtime = 'nodejs';

/**
 * GET /api/github/callback
 *
 * Handles the OAuth redirect after the user consents on GitHub.
 * Supabase appends `code` (PKCE) or `error` query parameters.
 *
 * On success: extracts github_username from the newly-linked identity
 *             and writes it to profiles, then redirects to profile page.
 * On failure: redirects to profile page with an error query param.
 */
export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const profileUrl = `${origin}/portal/profile`;

    // ── Handle OAuth errors sent back by Supabase / GitHub ──
    const oauthError = searchParams.get('error');
    const oauthDesc =
        searchParams.get('error_description') ?? 'GitHub linking failed.';

    if (oauthError) {
        console.error(`GitHub OAuth error: ${oauthError} – ${oauthDesc}`);
        return NextResponse.redirect(
            `${profileUrl}?github_error=${encodeURIComponent(oauthDesc)}`,
        );
    }

    // ── Exchange auth code for session ──
    const code = searchParams.get('code');
    if (!code) {
        return NextResponse.redirect(
            `${profileUrl}?github_error=${encodeURIComponent('No authorization code received from GitHub.')}`,
        );
    }

    const supabase = await createClient();

    const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
        console.error('Code exchange failed:', exchangeError);
        return NextResponse.redirect(
            `${profileUrl}?github_error=${encodeURIComponent('Failed to complete GitHub authentication.')}`,
        );
    }

    // ── Extract GitHub username from the newly-linked identity ──
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(
            `${profileUrl}?github_error=${encodeURIComponent('Session lost during GitHub linking.')}`,
        );
    }

    const githubIdentity = user.identities?.find(
        (i) => i.provider === 'github',
    );

    const githubUsername: string | undefined =
        githubIdentity?.identity_data?.user_name ??
        githubIdentity?.identity_data?.preferred_username;

    if (!githubUsername) {
        // Identity was linked but we couldn't extract the username – user can
        // enter it manually from the profile page.
        return NextResponse.redirect(
            `${profileUrl}?github_linked=true&github_error=${encodeURIComponent('GitHub linked but username could not be detected. Please enter it manually.')}`,
        );
    }

    // ── Persist to profiles table (use service role to bypass RLS) ──
    try {
        const serviceClient = getServiceRoleClient();
        const { error: updateError } = await serviceClient
            .from('profiles')
            .update({ github_username: githubUsername.toLowerCase() })
            .eq('id', user.id);

        if (updateError) throw updateError;
    } catch (err) {
        console.error('Failed to save github_username:', err);
        return NextResponse.redirect(
            `${profileUrl}?github_linked=true&github_error=${encodeURIComponent('GitHub linked but failed to save username. Please enter it manually.')}`,
        );
    }

    return NextResponse.redirect(`${profileUrl}?github_linked=true`);
}
