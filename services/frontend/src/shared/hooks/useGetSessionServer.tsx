import useSupabaseServer from '../utils/supabase/server';

export default async function useGetServerSession() {
  const supabase = useSupabaseServer();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}
