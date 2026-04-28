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

    const origin = process.env.DEPLOY_PRIME_URL ?? request.nextUrl.origin;
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

    const serviceClient = getServiceRoleClient();
    const { error: upsertError } = await serviceClient
        .from('github_user_tokens')
        .upsert(
            {
                user_id: user.id,
                access_token,
                refresh_token,
                access_expires_at: accessExpiresAt,
                refresh_expires_at: refreshExpiresAt,
                scope: scope ?? null,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
        );

    if (upsertError) {
        console.error('Failed to persist github_user_tokens:', upsertError);
        return fail('persist_failed');
    }

    try {
        const ghUserRes = await fetch('https://api.github.com/user', {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${access_token}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
        if (ghUserRes.ok) {
            const ghUser = (await ghUserRes.json()) as { login?: string };
            if (ghUser.login) {
                const { error: profileError } = await serviceClient
                    .from('profiles')
                    .update({ github_username: ghUser.login.toLowerCase() })
                    .eq('id', user.id);
                if (profileError) {
                    console.error('Failed to save github_username:', profileError);
                }
            }
        } else {
            console.error('GET /user returned', ghUserRes.status);
        }
    } catch (err) {
        console.error('Failed to fetch github user:', err);
    }

    const response = NextResponse.redirect(`${profileBase}?app_authorized=true`);
    response.cookies.set('gh_app_state', '', { maxAge: 0, path: '/api/github' });
    return response;
}
