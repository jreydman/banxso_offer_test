import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from 'src/shared/ui/components/chadcn/ui/pagination';

interface FilePaginationBarProps {
  page;
  setPage;
  totalPageCount;
}

const PAGE_LIMIT = 4;

export default function FilePaginationBar({
  page,
  setPage,
  totalPageCount,
}: FilePaginationBarProps) {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPageCount) {
      setPage(newPage);
    }
  };

  const getPageNumbers = () => {
    let startPage = Math.max(page - PAGE_LIMIT, 1);
    let endPage = Math.min(page + PAGE_LIMIT, totalPageCount);

    if (endPage - startPage < PAGE_LIMIT * 2) {
      if (startPage === 1) {
        endPage = Math.min(totalPageCount, startPage + PAGE_LIMIT * 2);
      } else if (endPage === totalPageCount) {
        startPage = Math.max(1, endPage - PAGE_LIMIT * 2);
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
        </PaginationItem>

        {getPageNumbers().map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              onClick={() => handlePageChange(pageNumber)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {totalPageCount > PAGE_LIMIT * 2 + 1 && page - PAGE_LIMIT > 1 && (
          <PaginationEllipsis />
        )}
        {totalPageCount > PAGE_LIMIT * 2 + 1 &&
          page + PAGE_LIMIT < totalPageCount && <PaginationEllipsis />}

        <PaginationItem>
          <PaginationNext onClick={() => handlePageChange(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
