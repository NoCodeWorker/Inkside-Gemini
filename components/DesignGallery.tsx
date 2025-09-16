import React from 'react';
import type { SavedDesign } from '../types';
import { useTranslations } from '../i18n/useTranslations';
import { ImageIcon, DownloadIcon } from './icons';

interface DesignGalleryProps {
  designs: SavedDesign[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDownloadAll: () => void;
  isDownloadingAll: boolean;
}

const DesignGallery: React.FC<DesignGalleryProps> = ({ designs, isLoading, currentPage, totalPages, onPageChange, onDownloadAll, isDownloadingAll }) => {
  const { t } = useTranslations();

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1); 
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const renderPagination = () => (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={handlePrevPage}
        disabled={currentPage <= 1 || isLoading}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {t('gallery.prev')}
      </button>
      <span className="text-sm text-gray-600">
        {t('gallery.page', { current: currentPage, total: totalPages })}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage >= totalPages || isLoading}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {t('gallery.next')}
      </button>
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">{t('gallery.title')}</h2>
        {!isLoading && designs.length > 0 && (
          <button
            onClick={onDownloadAll}
            disabled={isDownloadingAll}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition px-4 py-2"
          >
            {isDownloadingAll ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('gallery.downloading')}
              </>
            ) : (
              <>
                <DownloadIcon className="w-4 h-4" />
                {t('gallery.downloadAll')}
              </>
            )}
          </button>
        )}
      </div>
      
      {isLoading && designs.length === 0 && (
        <div className="text-center text-gray-600">
            <svg className="animate-spin h-8 w-8 text-gray-800 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      )}

      {!isLoading && designs.length === 0 && (
         <div className="text-center text-gray-500 py-12 px-6 bg-white rounded-lg border border-gray-200">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">{t('gallery.emptyTitle')}</h3>
            <p className="text-sm mt-1">{t('gallery.emptySubtitle')}</p>
        </div>
      )}

      {designs.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {designs.map(design => (
              <div key={design.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden group relative shadow-sm hover:shadow-md transition-shadow">
                <img src={design.imageUrl} alt={design.prompt} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-end p-2">
                  <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity truncate">{design.prompt}</p>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </section>
  );
};

export default DesignGallery;