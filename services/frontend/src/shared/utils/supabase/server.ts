import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import constants from 'src/shared/constants/supabase';

export default function useSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(constants.publicURL!, constants.serviceKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}
