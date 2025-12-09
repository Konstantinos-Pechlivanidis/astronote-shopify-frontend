import GlassButton from './GlassButton';
import Icon from './Icon';

/**
 * Glass Pagination Component
 * Professional, modern, and fully responsive pagination component
 */
export default function GlassPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  showInfo = true,
  totalItems = null,
  itemName = 'items',
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onPageChange(newPage);
      // Scroll to top of table/list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {showInfo && (
        <div className="text-sm text-primary order-2 sm:order-1">
          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>
          {totalItems !== null && (
            <span className="ml-2 opacity-75">
              ({totalItems.toLocaleString()} {totalItems === 1 ? itemName.slice(0, -1) : itemName} total)
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap order-1 sm:order-2">
        {/* Previous Button */}
        <GlassButton
          variant="ghost"
          size="md"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="min-h-[44px] min-w-[44px]"
          aria-label="Previous page"
        >
          <Icon name="arrowRight" size="sm" className="rotate-180" />
        </GlassButton>

        {/* First Page */}
        {startPage > 1 && (
          <>
            <GlassButton
              variant={1 === currentPage ? 'primary' : 'ghost'}
              size="md"
              onClick={() => handlePageChange(1)}
              className="min-h-[44px] min-w-[44px]"
              aria-label="Go to page 1"
            >
              1
            </GlassButton>
            {startPage > 2 && (
              <span className="text-primary px-2 text-sm">...</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pages.map((page) => (
          <GlassButton
            key={page}
            variant={page === currentPage ? 'primary' : 'ghost'}
            size="md"
            onClick={() => handlePageChange(page)}
            className="min-h-[44px] min-w-[44px]"
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </GlassButton>
        ))}

        {/* Last Page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-primary px-2 text-sm">...</span>
            )}
            <GlassButton
              variant={totalPages === currentPage ? 'primary' : 'ghost'}
              size="md"
              onClick={() => handlePageChange(totalPages)}
              className="min-h-[44px] min-w-[44px]"
              aria-label={`Go to page ${totalPages}`}
            >
              {totalPages}
            </GlassButton>
          </>
        )}

        {/* Next Button */}
        <GlassButton
          variant="ghost"
          size="md"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="min-h-[44px] min-w-[44px]"
          aria-label="Next page"
        >
          <Icon name="arrowRight" size="sm" />
        </GlassButton>
      </div>
    </div>
  );
}
