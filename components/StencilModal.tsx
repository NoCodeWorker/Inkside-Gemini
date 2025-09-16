import React from 'react';
import { DownloadIcon, XIcon, LoadingSpinnerIcon } from './icons';
import { useTranslations } from '../i18n/useTranslations';

interface SecondaryArtModalProps {
  isOpen: boolean;
  mode: 'stencil' | 'shield';
  onClose: () => void;
  onGenerate: () => void;
  stencilImage: string | null; // Keep name for consistency, represents both stencil and shield
  isStencilLoading: boolean; // Keep name for consistency
  originalImageAlt: string;
}

const StencilModal: React.FC<SecondaryArtModalProps> = ({
  isOpen,
  mode,
  onClose,
  onGenerate,
  stencilImage,
  isStencilLoading,
  originalImageAlt,
}) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  const texts = {
    stencil: {
      initial: t('stencilModal.stencil.initial.title'),
      subtitle: t('stencilModal.stencil.initial.subtitle'),
      confirm: t('stencilModal.stencil.initial.confirm'),
      cancel: t('stencilModal.stencil.initial.cancel'),
      loadingTitle: t('stencilModal.stencil.loading.title'),
      loadingSubtitle: t('stencilModal.stencil.loading.subtitle'),
      successTitle: t('stencilModal.stencil.success.title'),
      successAlt: t('stencilModal.stencil.success.altText'),
      download: t('stencilModal.stencil.success.download'),
    },
    shield: {
      initial: t('stencilModal.shield.initial.title'),
      subtitle: t('stencilModal.shield.initial.subtitle'),
      confirm: t('stencilModal.shield.initial.confirm'),
      cancel: t('stencilModal.shield.initial.cancel'),
      loadingTitle: t('stencilModal.shield.loading.title'),
      loadingSubtitle: t('stencilModal.shield.loading.subtitle'),
      successTitle: t('stencilModal.shield.success.title'),
      successAlt: t('stencilModal.shield.success.altText'),
      download: t('stencilModal.shield.success.download'),
    },
  };

  const currentTexts = texts[mode];

  const handleDownloadSecondaryArt = () => {
    if (!stencilImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${stencilImage}`;
    const filename = originalImageAlt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${filename}_${mode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative text-center transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" aria-label={t('stencilModal.closeAria')}>
          <XIcon className="w-6 h-6" />
        </button>

        {!stencilImage && !isStencilLoading && (
          <>
            <h2 className="text-xl font-bold mb-2">{currentTexts.initial}</h2>
            <p className="text-gray-600 mb-6">{currentTexts.subtitle}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={onGenerate} className="w-full py-2 px-6 bg-[#333333] text-white font-semibold rounded-lg hover:bg-black transition-colors order-1 sm:order-2">
                {currentTexts.confirm}
              </button>
              <button onClick={onClose} className="w-full py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors order-2 sm:order-1">
                {currentTexts.cancel}
              </button>
            </div>
          </>
        )}

        {isStencilLoading && (
          <>
            <h2 className="text-xl font-bold mb-4">{currentTexts.loadingTitle}</h2>
            <div className="flex justify-center my-6">
              <LoadingSpinnerIcon className="w-12 h-12 text-[#333333] animate-spin" />
            </div>
            <p className="text-gray-600">{currentTexts.loadingSubtitle}</p>
          </>
        )}

        {stencilImage && !isStencilLoading && (
          <>
            <h2 className="text-xl font-bold mb-4">{currentTexts.successTitle}</h2>
            <div className="bg-gray-100 rounded-lg p-2 my-4 border border-gray-200">
              <img src={`data:image/png;base64,${stencilImage}`} alt={currentTexts.successAlt} className="w-full h-auto object-contain max-h-80" />
            </div>
            <button onClick={handleDownloadSecondaryArt} className="w-full mt-2 flex items-center justify-center gap-2 bg-[#333333] text-white font-semibold py-3 px-4 rounded-lg hover:bg-black transition-colors">
              <DownloadIcon className="w-5 h-5" />
              {currentTexts.download}
            </button>
          </>
        )}
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StencilModal;