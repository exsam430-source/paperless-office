import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from './Button';
import { cn } from '@utils/cn';

const Pagination = ({ 
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  className,
}) => {
  const pages = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {showFirstLast && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          leftIcon={<ChevronsLeft className="w-4 h-4" />}
        >
          First
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        Prev
      </Button>

      <div className="flex items-center gap-2">
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-lg"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-slate-500 font-bold">···</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200',
              page === currentPage
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-purple-500/30 scale-110'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110'
            )}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-slate-500 font-bold">···</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-lg"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        Next
      </Button>

      {showFirstLast && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          rightIcon={<ChevronsRight className="w-4 h-4" />}
        >
          Last
        </Button>
      )}
    </div>
  );
};

export default Pagination;