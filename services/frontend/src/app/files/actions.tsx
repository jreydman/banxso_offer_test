import useGetBrowserSession from 'src/shared/hooks/useGetSessionBrowser';

export async function fetchFilesWithPagination({
  supabase,
  searchValue = '',
  page = 1,
}) {
  const session = await useGetBrowserSession(supabase);
  const bucketId = session.user.id;

  try {
    const pageSize = 4;

    const { data, error } = await supabase.storage
      .from('file_bucket')
      .list(bucketId, {
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.log('Error fetching files:', error);
      throw error;
    }

    if (!data) return { files: [], totalPages: 0 };

    let sortedFiles = data;

    if (searchValue) {
      sortedFiles = data.filter((file) =>
        file.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    //exclude supabase crap
    sortedFiles = sortedFiles.filter(
      (file) => file.name !== '.emptyFolderPlaceholder'
    );

    const fetchFilesMeta = await supabase
      .from('Files')
      .select('*')
      .in(
        'file_id',
        sortedFiles.map((file) => file.id)
      )
      .eq('user_id', bucketId);

    const filesWithMeta = sortedFiles.map((file) => {
      const meta = fetchFilesMeta.data.find((m) => file.id == m.file_id);
      file.description = meta.file_description;
      file.download_count = meta.download_count;
      return file;
    });

    const totalPages = Math.ceil(filesWithMeta.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedFiles = filesWithMeta.slice(startIndex, endIndex);

    return {
      files: pagedFiles,
      totalPages: totalPages,
    };
  } catch (error) {
    console.log(error);
    return { files: [], totalPages: 0 };
  }
}
