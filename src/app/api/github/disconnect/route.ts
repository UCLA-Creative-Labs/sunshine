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

    try {
        const serviceClient = getServiceRoleClient();

        const { error: tokenError } = await serviceClient
            .from('github_user_tokens')
            .delete()
            .eq('user_id', user.id);
        if (tokenError) throw tokenError;

        const { error: profileError } = await serviceClient
            .from('profiles')
            .update({ github_username: null })
            .eq('id', user.id);
        if (profileError) throw profileError;
    } catch (err) {
        console.error('Failed to disconnect GitHub:', err);
        return NextResponse.json(
            { error: 'Failed to disconnect GitHub.' },
            { status: 500 },
        );
    }

    return NextResponse.json({ success: true });
}
