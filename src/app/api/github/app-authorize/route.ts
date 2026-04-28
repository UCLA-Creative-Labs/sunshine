import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    const clientId = process.env.GITHUB_APP_CLIENT_ID;
    const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        return NextResponse.json(
            { error: 'Server is missing GITHUB_APP_CLIENT_ID or GITHUB_APP_CLIENT_SECRET.' },
            { status: 500 },
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json(
            { error: 'You must be logged in to authorize the GitHub App.' },
            { status: 401 },
        );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
    const redirectUri = `${siteUrl}/api/github/app-callback`;

    const state = randomBytes(16).toString('hex');

    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);

    const response = NextResponse.json({ url: url.toString() });
    response.cookies.set('gh_app_state', state, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/api/github',
        maxAge: 600,
    });
    return response;
}
