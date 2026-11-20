import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const clientId = process.env.GITHUB_APP_CLIENT_ID;
    const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        return NextResponse.json(
            { error: 'Server is missing GITHUB_APP_CLIENT_ID or GITHUB_APP_CLIENT_SECRET.' },
            { status: 500 },
        );
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.DEPLOY_PRIME_URL ?? request.nextUrl.origin;
    const redirectUri = `${origin}/api/github/app-callback`;
    const profileBase = `${origin}/portal/profile`;

    const params = request.nextUrl.searchParams;
    const code = params.get('code');
    const stateParam = params.get('state');
    const errParam = params.get('error');
    const errDesc = params.get('error_description');

    const fail = (msg: string) => {
        const r = NextResponse.redirect(`${profileBase}?app_error=${encodeURIComponent(msg)}`);
        r.cookies.set('gh_app_state', '', { maxAge: 0, path: '/api/github' });
        return r;
    };

    if (errParam) {
        return fail(errDesc ?? errParam);
    }

    const cookieState = request.cookies.get('gh_app_state')?.value;
    if (!cookieState || !stateParam || cookieState !== stateParam) {
        return fail('invalid_state');
    }

    if (!code) {
        return fail('missing_code');
    }

    const supabase = await createClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return fail('session_lost');
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
        }),
    });

    const tokenBody = await tokenRes.json().catch(() => ({}));

    if (!tokenRes.ok || tokenBody.error) {
        return fail(tokenBody.error_description ?? tokenBody.error ?? 'token_exchange_failed');
    }

    const {
        access_token,
        refresh_token,
        expires_in,
        refresh_token_expires_in,
        scope,
    } = tokenBody as {
        access_token?: string;
        refresh_token?: string;
        expires_in?: number | string;
        refresh_token_expires_in?: number | string;
        scope?: string;
    };

    if (!access_token || !refresh_token || !expires_in || !refresh_token_expires_in) {
        return fail('token_response_incomplete');
    }

    const now = Date.now();
    const accessExpiresAt = new Date(now + (Number(expires_in) - 30) * 1000).toISOString();
    const refreshExpiresAt = new Date(now + (Number(refresh_token_expires_in) - 86400) * 1000).toISOString();

    try {
        const githubUserResponse = await fetch('https://api.github.com/user', {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${access_token}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        if (!githubUserResponse.ok) return fail('github_identity_failed');

        const githubUser = (await githubUserResponse.json()) as { login?: string };
        if (!githubUser.login) return fail('github_identity_missing');

        // The database saves both records together, so a failed link leaves no partial changes.
        const { error } = await getServiceRoleClient().rpc('link_verified_github_account', {
            p_user_id: user.id,
            p_username: githubUser.login.toLowerCase(),
            p_access_token: access_token,
            p_refresh_token: refresh_token,
            p_access_expires_at: accessExpiresAt,
            p_refresh_expires_at: refreshExpiresAt,
            p_scope: scope ?? null,
        });
        if (error) {
            console.error('Failed to link verified GitHub account:', error.code);
            if (error.code === '23505') {
                return fail('github_account_already_linked');
            }
            return fail('persist_failed');
        }
    } catch {
        return fail('github_identity_failed');
    }

    const response = NextResponse.redirect(`${profileBase}?app_authorized=true`);
    response.cookies.set('gh_app_state', '', { maxAge: 0, path: '/api/github' });
    return response;
}
