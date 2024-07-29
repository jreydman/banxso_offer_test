import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import useSupabaseBrowser from '../utils/supabase/client';

export default function useSessionLogout() {
  const supabase = useSupabaseBrowser();
  const router = useRouter();

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.refresh();
    } else {
      console.error('Error logging out:', error.message);
    }
  }, [supabase, router]);

  return logout;
}
