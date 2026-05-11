import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

export const runtime = 'nodejs';

export async function GET() {
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

    const serviceClient = getServiceRoleClient();
    const { data, error } = await serviceClient
        .from('github_user_tokens')
        .select('access_expires_at, refresh_expires_at')
        .eq('user_id', user.id)
        .maybeSingle();

    if (error) {
        console.error('Failed to read github_user_tokens:', error);
        return NextResponse.json(
            { error: 'Failed to read authorization status.' },
            { status: 500 },
        );
    }

    if (!data) {
        return NextResponse.json({ authorized: false, expires_at: null });
    }

    const refreshValid = new Date(data.refresh_expires_at).getTime() > Date.now();
    return NextResponse.json({
        authorized: refreshValid,
        expires_at: data.access_expires_at ?? null,
    });
}
