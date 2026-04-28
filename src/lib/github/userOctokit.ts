import { Octokit } from '@octokit/core';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getServiceRoleClient } from '@/lib/supabase/serviceRoleClient';

interface TokenRow {
    user_id: string;
    access_token: string;
    refresh_token: string;
    access_expires_at: string;
    refresh_expires_at: string;
    scope: string | null;
}

async function refreshTokens(
    serviceClient: SupabaseClient,
    row: TokenRow,
    clientId: string,
    clientSecret: string,
): Promise<string | null> {
    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: row.refresh_token,
        }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok || body.error || !body.access_token || !body.refresh_token) {
        await serviceClient.from('github_user_tokens').delete().eq('user_id', row.user_id);
        return null;
    }

    const now = Date.now();
    const accessExpiresAt = new Date(now + (Number(body.expires_in) - 30) * 1000).toISOString();
    const refreshExpiresAt = new Date(now + (Number(body.refresh_token_expires_in) - 86400) * 1000).toISOString();

    const { error } = await serviceClient.from('github_user_tokens').upsert(
        {
            user_id: row.user_id,
            access_token: body.access_token,
            refresh_token: body.refresh_token,
            access_expires_at: accessExpiresAt,
            refresh_expires_at: refreshExpiresAt,
            scope: body.scope ?? row.scope,
            updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
    );

    if (error) {
        console.error('Failed to persist refreshed github_user_tokens:', error);
        return null;
    }

    return body.access_token as string;
}

export async function getUserOctokit(
    userId: string,
    _supabase?: SupabaseClient,
): Promise<Octokit | null> {
    const clientId = process.env.GITHUB_APP_CLIENT_ID;
    const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error('Server is missing GITHUB_APP_CLIENT_ID or GITHUB_APP_CLIENT_SECRET.');
    }

    const serviceClient = getServiceRoleClient();
    const { data, error } = await serviceClient
        .from('github_user_tokens')
        .select('user_id, access_token, refresh_token, access_expires_at, refresh_expires_at, scope')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('Failed to read github_user_tokens:', error);
        return null;
    }

    if (!data) return null;

    const row = data as TokenRow;
    const now = Date.now();

    if (new Date(row.access_expires_at).getTime() > now) {
        return new Octokit({ auth: row.access_token });
    }

    if (new Date(row.refresh_expires_at).getTime() > now) {
        const newToken = await refreshTokens(serviceClient, row, clientId, clientSecret);
        if (!newToken) return null;
        return new Octokit({ auth: newToken });
    }

    await serviceClient.from('github_user_tokens').delete().eq('user_id', userId);
    return null;
}
