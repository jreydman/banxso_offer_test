export default async function useGetBrowserSession(supabase) {
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
