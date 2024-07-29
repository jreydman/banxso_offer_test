'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Session } from '@supabase/supabase-js';
import { ReactNode } from 'react';
import useGetBrowserSession from 'src/shared/hooks/useGetSessionBrowser';
import useSupabaseBrowser from './client';

interface AuthContext {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContext>({
  session: null,
  isLoading: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: () => useGetBrowserSession(supabase),
  });

  useEffect(() => {
    if (!data) return;
    setSession(data);
  }, [data]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(['session'], session);
    });

    return () => subscription.unsubscribe();
  }, [supabase, queryClient]);

  const value = useMemo(() => session, [session]);
  // console.log('path: AuthProvider', value);

  return (
    <AuthContext.Provider value={{ session: value, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
