import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * POST /api/github/link-account
 *
 * Initiates GitHub identity linking via Supabase Auth.
 * Returns a { url } the client should redirect to (GitHub OAuth consent).
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json(
            { error: 'You must be logged in to link a GitHub account.' },
            { status: 401 },
        );
    }

    const githubIdentity = user.identities?.find(
        (i) => i.provider === 'github',
    );
    if (githubIdentity) {
        return NextResponse.json(
            { error: 'A GitHub account is already linked.' },
            { status: 409 },
        );
    }

    const origin = request.nextUrl.origin;

    const { data, error } = await supabase.auth.linkIdentity({
        provider: 'github',
        options: {
            redirectTo: `${origin}/api/github/callback`,
            skipBrowserRedirect: true,
            scopes: 'read:user user:email',
        },
    });

    if (error) {
        console.error('linkIdentity failed:', error);
        return NextResponse.json(
            { error: error.message ?? 'Failed to initiate GitHub linking.' },
            { status: 400 },
        );
    }

    const url = data?.url;

    if (!url) {
        return NextResponse.json(
            { error: 'No redirect URL returned from Supabase.' },
            { status: 500 },
        );
    }

    return NextResponse.json({ url });
}
