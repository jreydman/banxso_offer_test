import { createBrowserClient as createCLient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { useMemo } from 'react';
import constants from 'src/shared/constants/supabase';

let client: SupabaseClient | undefined;

function getSupabaseBrowser() {
  if (client) {
    return client;
  }
  client = createCLient(constants.publicURL!, constants.anonKey!);

  return client;
}

function useSupabaseBrowser() {
  return useMemo(getSupabaseBrowser, []);
}

export default useSupabaseBrowser;
