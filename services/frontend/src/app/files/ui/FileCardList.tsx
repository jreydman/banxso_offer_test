'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import useSupabaseBrowser from 'src/shared/utils/supabase/client';
import { fetchFilesWithPagination } from '../actions';
import FileCard from './FileCard';

interface FileCardListProps {
  page;
  setTotalPageCount;
  searchValue;
}

export default function FileCardList({
  page,
  setTotalPageCount,
  searchValue,
}: FileCardListProps) {
  const supabase = useSupabaseBrowser();

  const { data, isLoading } = useQuery({
    queryKey: ['files', page, searchValue],
    queryFn: () => fetchFilesWithPagination({ supabase, page, searchValue }),
  });

  useEffect(() => {
    if (!data) return;
    setTotalPageCount(data.totalPages);
  }, [data]);

  return (
    <div className="flex flex-wrap justify-evenly">
      {isLoading && <>Loading...</>}

      {!data
        ? null
        : data.files.map((file, index) => (
            <div key={index} className="p-3 flex-grow-0">
              <FileCard file={file} />
            </div>
          ))}
    </div>
  );
}
