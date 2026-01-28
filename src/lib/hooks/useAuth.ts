import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import type { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  userId: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * hook to get the authenticated user from Supabase Auth
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(sessionError.message);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get session');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    userId: user?.id ?? null,
    user,
    isLoading,
    error,
  };
}
