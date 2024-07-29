'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useGetBrowserSession from 'src/shared/hooks/useGetSessionBrowser';
import useSupabaseBrowser from 'src/shared/utils/supabase/client';
import FileCardList from './ui/FileCardList';
import FilePaginationBar from './ui/FilePaginationBar';
import SearchBar from './ui/SearchBar';

export default function FilesPage() {
  //FIX make filesContext
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const supabase = useSupabaseBrowser();
  const [searchValue, setSearchValue] = useState();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await useGetBrowserSession(supabase);
      if (!session) router.push('/auth');
    };

    checkSession();
  }, [supabase]);

  return (
    <>
      Files Page
      <header className="flex flex-row justify-center">
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      </header>
      <main className={'min-h-[80vh]'}>
        <div className="container mx-auto">
          <FileCardList
            page={page}
            setTotalPageCount={setTotalPageCount}
            searchValue={searchValue}
          />
        </div>
      </main>
      <footer>
        <FilePaginationBar
          page={page}
          setPage={setPage}
          totalPageCount={totalPageCount}
        />
      </footer>
    </>
  );
}
