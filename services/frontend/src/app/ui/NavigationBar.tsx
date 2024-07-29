'use server';

import { headers } from 'next/headers';
import Link from 'next/link';
import useGetServerSession from 'src/shared/hooks/useGetSessionServer';
import { Button } from 'src/shared/ui/components/chadcn/ui/button';
import ProfileTabMenu from './ProfileTabMenu';

export default async function NavigationBar() {
  const session = await useGetServerSession();

  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';

  return (
    <div className="flex justify-between items-center p-4">
      <div>
        <Link href="/">
          <h1 className="text-xl font-bold">FileBucket</h1>
        </Link>
      </div>
      <div>{session && <Link href={'/files'}>Dashboard</Link>}</div>
      <div>
        {session ? (
          <ProfileTabMenu />
        ) : !pathname.includes('auth') ? (
          <Link href={'auth'}>
            <Button variant={'outline'}>Sign</Button>
          </Link>
        ) : null}
      </div>
      {/* <div>{!session || <ProfileTabMenu />}</div> */}
    </div>
  );
}
