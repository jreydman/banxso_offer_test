'use server';

import { redirect } from 'next/navigation';
import useSupabaseServer from 'src/shared/utils/supabase/server';

export default async function ProfilePage() {
  const supabase = useSupabaseServer();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/auth');
  }
  const user = data.user;

  return (
    <div>
      <h1>Profile</h1>
      <div>
        <img
          src={user.user_metadata.picture}
          alt={user.user_metadata.full_name}
        />
        <div>
          <h2>{user.user_metadata.full_name}</h2>
          <p>Email: {user.email}</p>
          <p>Username: {user.user_metadata.preferred_username}</p>
          <p>
            Phone Verified: {user.user_metadata.phone_verified ? 'Yes' : 'No'}
          </p>
          <p>Last Sign-In: {new Date(user.last_sign_in_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
