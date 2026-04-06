'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { buildPageNumbers, ELLIPSIS } from '@/lib/utils';

const CoinPagination = ({
  currentPage,
  totalPages,
  hasMorePages,
}: Pagination) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`coins?page=${page}`);
  };

  const pageNumbers = buildPageNumbers(currentPage, totalPages).filter(
    (page, index) => !(page === ELLIPSIS && index === 0)
  );

  const isLastPage = !hasMorePages || currentPage === totalPages;

  return (
    <PaginationRoot id="coins-pagination">
      <PaginationContent className="pagination-content">
        <PaginationItem className="pagination-control prev">
          <PaginationPrevious
            onClick={() => {
              currentPage > 1 && handlePageChange(currentPage - 1);
            }}
            className={
              currentPage === 1 ? 'control-disabled' : 'control-button'
            }
          />
        </PaginationItem>

        <div className="pagination-pages">
          {pageNumbers.map((page, index) => (
            <PaginationItem key={`${page}-${index}`}>
              {page === ELLIPSIS ? (
                <PaginationEllipsis className="ellipsis" />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  className={cn('page-link', {
                    'page-link-active': currentPage === page,
                  })}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="pagination-control next">
          <PaginationNext
            onClick={() => {
              !isLastPage && handlePageChange(currentPage + 1);
            }}
            className={isLastPage ? 'control-disabled' : 'control-button'}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};

export default CoinPagination;
