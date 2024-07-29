'use server';

import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import useGetServerSession from 'src/shared/hooks/useGetSessionServer';
const FilesPage = dynamic(() => import('src/app/files/page'));

export default async function MainPage() {
  const session = await useGetServerSession();
  if (!session) {
    redirect('/auth');
  }
  return <FilesPage />;
}
