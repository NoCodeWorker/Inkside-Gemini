import React from 'react';
import { ImageIcon, LoadingSpinnerIcon, DownloadIcon, ShareIcon } from './icons';
import { useTranslations } from '../i18n/useTranslations';
import { TattooStyle } from '../types';

interface ImageDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  prompt?: string;
  style?: TattooStyle;
  onDownload: () => void;
  onShare: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ generatedImage, isLoading, prompt, style, onDownload, onShare }) => {
  const { t } = useTranslations();
  
  const styleName = style ? t(`tattooStyles.${style}`) : '';

  const altText = prompt && styleName
    ? t('imageDisplay.altText', { prompt, style: styleName })
    : t('imageDisplay.altTextDefault');
  
  return (
    <div 
      className="w-full aspect-square bg-white rounded-xl border border-gray-200 flex items-center justify-center p-4 relative overflow-hidden shadow-sm"
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <h2 className="sr-only">{t('imageDisplay.title')}</h2>
      {isLoading && (
        <div className="text-center text-gray-600 flex flex-col items-center gap-4">
          <LoadingSpinnerIcon className="w-12 h-12 text-[#333333] animate-spin" />
          <p className="font-medium">{t('imageDisplay.loading.title')}</p>
          <p className="text-sm">{t('imageDisplay.loading.subtitle')}</p>
        </div>
      )}
      {!isLoading && generatedImage && (
        <>
          <img
            src={generatedImage}
            alt={altText}
            className="w-full h-full object-contain rounded-lg animate-fade-in"
            style={{ animation: 'fadeIn 0.5s ease-in-out' }}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onDownload}
              className="bg-white/80 p-3 rounded-full backdrop-blur-sm hover:bg-white transition-all shadow-md group"
              aria-label={t('imageDisplay.downloadAria')}
            >
              <DownloadIcon className="w-5 h-5 text-gray-700 group-hover:text-black" />
            </button>
            <button
              onClick={onShare}
              className="bg-white/80 p-3 rounded-full backdrop-blur-sm hover:bg-white transition-all shadow-md group"
              aria-label={t('imageDisplay.shareAria')}
            >
              <ShareIcon className="w-5 h-5 text-gray-700 group-hover:text-black" />
            </button>
          </div>
        </>
      )}
      {!isLoading && !generatedImage && (
        <div className="text-center text-gray-500 flex flex-col items-center gap-4">
          <ImageIcon className="w-16 h-16 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700">{t('imageDisplay.initial.title')}</h3>
          <p className="text-sm">
            {t('imageDisplay.initial.subtitle')}
          </p>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ImageDisplay;