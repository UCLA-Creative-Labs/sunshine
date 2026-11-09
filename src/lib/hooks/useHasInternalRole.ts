import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

/** Internal roles allowed to manage each committee page or feature. */
export const APPROVER_ROLES = {
  design: ['director', 'president', 'board - design'],
  finance: ['director', 'president', 'board - finance'],
  tinycl: ['director', 'president'],
  clubAnnouncements: ['director', 'president'],
} as const;

/**
 * Returns true when the current user has one of `allowedRoles` as an
 * internal role. Returns false if the user is signed out or the role
 * query fails. Pass a stable array (e.g. from APPROVER_ROLES).
 */
export function useHasInternalRole(allowedRoles: readonly string[]) {
  const [hasRole, setHasRole] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) {
          setHasRole(false);
          setIsLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from('user_context_roles')
        .select('context, roles!inner(name)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to load internal roles:', error);
      }

      const allowed = !error && (data || []).some((row) => {
        if (row.context !== 'internal') return false;
        const name = (row.roles as unknown as { name: string })?.name;
        return allowedRoles.includes(name);
      });

      if (!cancelled) {
        setHasRole(allowed);
        setIsLoading(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, [allowedRoles]);

  return { hasRole, isLoading };
}
