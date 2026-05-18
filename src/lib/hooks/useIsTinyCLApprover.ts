import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

const APPROVER_ROLES = ['director', 'president'];

/**
 * Returns true when the current user has an internal role allowed to
 * manage TinyCL links.
 */
export function useIsTinyCLApprover() {
  const [isApprover, setIsApprover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) {
          setIsApprover(false);
          setIsLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from('user_context_roles')
        .select('context, roles!inner(name)')
        .eq('user_id', user.id);

      const allowed = (data || []).some((row) => {
        if (row.context !== 'internal') return false;
        const name = (row.roles as unknown as { name: string })?.name;
        return APPROVER_ROLES.includes(name);
      });

      if (!cancelled) {
        setIsApprover(allowed);
        setIsLoading(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  return { isApprover, isLoading };
}
