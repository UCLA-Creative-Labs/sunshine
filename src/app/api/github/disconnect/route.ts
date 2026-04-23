import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

export const runtime = 'nodejs';

export async function POST() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json(
            { error: 'You must be logged in.' },
            { status: 401 },
        );
    }

    const githubIdentity = user.identities?.find(
        (i) => i.provider === 'github',
    );
    if (!githubIdentity) {
        return NextResponse.json(
            { error: 'No GitHub account linked.' },
            { status: 404 },
        );
    }

    const { error: unlinkError } = await supabase.auth.unlinkIdentity(
        githubIdentity,
    );
    if (unlinkError) {
        console.error('unlinkIdentity failed:', unlinkError);
        return NextResponse.json(
            { error: unlinkError.message ?? 'Failed to disconnect GitHub.' },
            { status: 400 },
        );
    }

    try {
        const serviceClient = getServiceRoleClient();
        const { error: updateError } = await serviceClient
            .from('profiles')
            .update({ github_username: null })
            .eq('id', user.id);
        if (updateError) throw updateError;
    } catch (err) {
        console.error('Failed to clear github_username:', err);
        return NextResponse.json(
            {
                error: 'GitHub unlinked but failed to clear profile. Contact support.',
            },
            { status: 500 },
        );
    }

    return NextResponse.json({ success: true });
}
