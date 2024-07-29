'use server';

import { redirect } from 'next/navigation';
import useGetServerSession from 'src/shared/hooks/useGetSessionServer';
import SigninForm from './signin/signin-form';
import SignupForm from './signup/signup-form';

export default async function AuthPage() {
  const session = await useGetServerSession();
  if (session) redirect('/');
  return (
    <>
      <SigninForm />
      <hr />
      <SignupForm />
      <hr />
    </>
  );
}
