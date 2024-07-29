'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { Provider } from '@supabase/supabase-js';
import useSupabaseServer from 'src/shared/utils/supabase/server';
import { getURL } from 'src/shared/utils/url-helper/url-helper';

export async function signinEmail(inputData) {
  const supabase = useSupabaseServer();

  const data = {
    email: inputData.email as string,
    password: inputData.password as string,
  };

  console.log(data);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/auth?message=Could not authenticate user');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signupEmail(inputData) {
  const supabase = useSupabaseServer();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: inputData.email as string,
    password: inputData.password as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/auth?message=Error signing up');
  }

  revalidatePath('/', 'layout');
  redirect('/auth');
}

export async function signOut() {
  const supabase = useSupabaseServer();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function signinOAuth(provider: Provider) {
  if (!provider) {
    return redirect('/auth?message=No provider selected');
  }

  const supabase = useSupabaseServer();
  const redirectUrl = getURL('/auth/oauth/callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    redirect('/auth?message=Could not authenticate user');
  }

  return redirect(data.url);
}
