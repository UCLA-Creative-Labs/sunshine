import { createClient } from '@/lib/supabase/server';

/**
 * Feature flag: set to false to show the Internal tab to ALL authenticated users.
 * When true (default), the Internal tab is only shown to users with an internal role.
 */
export const SHOW_INTERNAL_TAB_TO_INTERNAL_USERS_ONLY = true;

/**
 * Returns true if the given array of user_context_roles rows contains any internal role.
 * Internal roles have context = 'internal'.
 */
export function hasInternalRole(
  roles: Array<{ context: string; roles: { name: string } }>
): boolean {
  return roles.some((r) => r.context === 'internal');
}

/**
 * Server-side: fetches the current authenticated user's roles from user_context_roles.
 * Returns the raw rows. Returns empty array if not authenticated or on error.
 */
export async function getInternalRoleForUser(): Promise<
  Array<{ context: string; roles: { name: string } }>
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_context_roles')
    .select('context, roles!inner(name)')
    .eq('user_id', user.id);

  if (error || !data) return [];
  return data as unknown as Array<{ context: string; roles: { name: string } }>;
}
