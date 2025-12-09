import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Professional ImageLightbox Component
 * Uses React Portal for proper rendering and full-screen image viewing
 */
export default function ImageLightbox({ children, imageSrc, imageAlt, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeLightbox();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const modalContent = isOpen && (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 bg-black/95 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeLightbox();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={imageAlt || 'Image viewer'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-sm animate-fade-in z-0"
        onClick={closeLightbox}
        aria-hidden="true"
      />

      {/* Close Button */}
      <button
        onClick={closeLightbox}
        className="fixed top-4 right-4 z-[10001] p-3 rounded-full bg-white/90 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[44px] min-h-[44px] flex items-center justify-center shadow-xl"
        aria-label="Close image viewer"
      >
        <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Image Container - Full Size with Scroll */}
      <div className="w-full h-full flex items-center justify-center overflow-auto p-4 relative z-[10000] pointer-events-none">
        <div className="flex flex-col items-center justify-center min-h-full py-8 pointer-events-auto">
          {/* Image - Display at full size, allow natural dimensions */}
          {imageSrc && (
            <img
              src={imageSrc}
              alt={imageAlt || 'Enlarged image'}
              className="object-contain rounded-lg shadow-2xl"
              style={{
                maxWidth: 'calc(100vw - 2rem)',
                maxHeight: 'calc(100vh - 2rem)',
                width: 'auto',
                height: 'auto',
                display: 'block',
                position: 'relative',
              }}
              loading="eager"
              decoding="async"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                console.error('Image failed to load:', imageSrc);
                e.target.style.display = 'none';
              }}
            />
          )}

          {/* Caption */}
          {imageAlt && (
            <div className="mt-6 text-center">
              <div className="inline-block px-6 py-3 rounded-lg bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg">
                <p className="text-base text-gray-900 font-medium">{imageAlt}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        onClick={openLightbox}
        className={`cursor-pointer group relative ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox();
          }
        }}
        aria-label={`View ${imageAlt || 'image'} in full size`}
      >
        {children}
        {/* Hover overlay indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Click to enlarge
            </span>
          </div>
        </div>
      </div>
      {isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
