import React, { useState, useCallback, useEffect } from 'react';
import { TattooStyle } from './types';
import { generateStencil, generateFrontShield } from './services/geminiService';
import { useAuth } from './contexts/AuthContext';
import { useDesignGenerator } from './hooks/useDesignGenerator';
import { useDesignGallery } from './hooks/useDesignGallery';
import { useTranslations } from './i18n/useTranslations';
import { useNotifications } from './hooks/useNotifications';

import Header from './components/Header';
import StyleSelector from './components/StyleSelector';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import Footer from './components/Footer';
import AdvancedOptions from './components/AdvancedOptions';
import StencilModal from './components/StencilModal';
import { SparklesIcon } from './components/icons';
import AuthModal from './components/AuthModal';
import PurchaseModal from './components/PurchaseModal';
import PrintfulAd from './components/PrintfulAd';
import DesignGallery from './components/DesignGallery';

const App: React.FC = () => {
  const { t, language } = useTranslations();
  const { user, userProfile, isAuthLoading, handleSignOut } = useAuth();
  const { showNotification } = useNotifications();
  
  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSecondaryModalOpen, setIsSecondaryModalOpen] = useState(false);
  const [secondaryImage, setSecondaryImage] = useState<string | null>(null);
  const [isSecondaryLoading, setIsSecondaryLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isApiReady, setIsApiReady] = useState(true);

  const {
    designs, isLoading: isGalleryLoading, currentPage, totalPages,
    fetchDesigns, handleDownloadAll, isDownloadingAll
  } = useDesignGallery();

  const {
    formState, apiState, creditsState, handleGenerate, handleStyleChange
  } = useDesignGenerator(() => fetchDesigns(1)); // Fetch first page on success
  
  // Destructure for easier access in JSX
  const { prompt, style } = formState;
  const { generatedImage, isLoading } = apiState;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('meta.title');
  }, [language, t]);
  
  // Check for critical environment variables on startup
  useEffect(() => {
    if (!process.env.API_KEY) {
      console.error("CRITICAL ERROR: Gemini API Key (API_KEY) is not configured in the environment.");
      showNotification(t('errors.ui.apiNotConfigured'), 'error');
      setIsApiReady(false);
    }
  }, [showNotification, t]);

  // Initial gallery fetch on user change
  useEffect(() => {
    if(user) {
        fetchDesigns(1);
    }
  }, [user]); // Removed fetchDesigns from dependency array as it's a stable callback

  // Handle Stripe redirect can be added here if needed
  
  const handleAuthSuccess = (isNewUser: boolean) => {
    setIsAuthModalOpen(false);
    if (isNewUser) {
      setIsPurchaseModalOpen(true);
    }
  };
  
  const handleGenerateClick = () => {
    handleGenerate(
      () => setIsPurchaseModalOpen(true),
      () => setIsAuthModalOpen(true)
    );
  };
  
  const handleDownloadAndOfferSecondary = () => {
    if (!generatedImage) return;

    const mimeType = generatedImage.startsWith('data:image/png') ? 'png' : 'jpeg';
    const link = document.createElement('a');
    link.href = generatedImage;
    const altText = prompt && style ? `Inkside_design_${prompt.replace(/\s+/g, '_')}_${style.replace(/\s+/g, '_')}` : 'Inkside_design';
    link.download = `${altText}.${mimeType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsSecondaryModalOpen(true);
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const mimeType = blob.type;
      const fileExtension = mimeType === 'image/png' ? 'png' : 'jpeg';
      const filename = prompt && style ? `Inkside_design_${prompt.replace(/\s+/g, '_')}_${style.replace(/\s+/g, '_')}.${fileExtension}` : `Inkside_design.${fileExtension}`;
      const file = new File([blob], filename, { type: blob.type });
      
      const shareData = {
        title: t('share.designTitle'),
        text: t('share.designText', { prompt }),
        files: [file],
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert(t('errors.ui.shareNotSupported'));
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        showNotification(t('errors.ui.shareFailed'));
      }
    }
  };
  
  const handleGenerateSecondaryArt = async () => {
    if (!generatedImage) return;
    
    const base64Data = generatedImage.split(',')[1];

    setIsSecondaryLoading(true);
    try {
      let secondaryData;
      if (style === TattooStyle.TSHIRT_DESIGN) {
        secondaryData = await generateFrontShield(base64Data);
      } else {
        secondaryData = await generateStencil(base64Data);
      }
      setSecondaryImage(secondaryData);
    } catch (err) {
      console.error("Secondary art generation failed:", err);
      const errorMessage = err instanceof Error ? err.message : 'errors.api.stencilGenerationFailed';
      showNotification(t(errorMessage, { fallback: t('errors.api.stencilGenerationFailed') }));
      handleCloseSecondaryModal();
    } finally {
      setIsSecondaryLoading(false);
    }
  };

  const handleCloseSecondaryModal = () => {
    setIsSecondaryModalOpen(false);
    setSecondaryImage(null);
    setIsSecondaryLoading(false);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const credits = user ? userProfile?.credits ?? 0 : creditsState.guestCredits;
  const creditText = user
    ? t('app.generateWithCredits', { count: credits })
    : t('app.generateWithGuestCredits', { count: credits });

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-gray-800 flex flex-col">
      <Header 
        user={user} 
        profile={userProfile} 
        guestCredits={creditsState.guestCredits}
        onSignOut={handleSignOut} 
        onSignInClick={() => setIsAuthModalOpen(true)}
        onBuyCreditsClick={() => setIsPurchaseModalOpen(true)}
      />

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 text-center" role="alert">
          <p>{successMessage}</p>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-2/3">
          <ImageDisplay
            generatedImage={generatedImage}
            isLoading={isLoading}
            prompt={prompt}
            style={style}
            onDownload={handleDownloadAndOfferSecondary}
            onShare={handleShare}
          />
          <PrintfulAd />
        </div>
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800 sr-only">{t('app.title')}</h1>
            <div className="flex flex-col gap-4">
              <StyleSelector
                selectedStyle={style}
                onStyleChange={handleStyleChange}
                styles={Object.values(TattooStyle)}
              />
              <PromptInput
                prompt={prompt}
                onPromptChange={formState.setPrompt}
                isLoading={isLoading}
              />
              <AdvancedOptions
                selectedStyle={style}
                bodyPart={formState.bodyPart}
                setBodyPart={formState.setBodyPart}
                sizeComplexity={formState.sizeComplexity}
                setSizeComplexity={formState.setSizeComplexity}
                tshirtColor={formState.tshirtColor}
                setTshirtColor={formState.setTshirtColor}
                tshirtPlacement={formState.tshirtPlacement}
                setTshirtPlacement={formState.setTshirtPlacement}
                colorChoice={formState.colorChoice}
                setColorChoice={formState.setColorChoice}
                colorPalette={formState.colorPalette}
                setColorPalette={formState.setColorPalette}
                accentColor={formState.accentColor}
                setAccentColor={formState.setAccentColor}
                supportingElements={formState.supportingElements}
                setSupportingElements={formState.setSupportingElements}
                mood={formState.mood}
                setMood={formState.setMood}
                composition={formState.composition}
                setComposition={formState.setComposition}
                textToInclude={formState.textToInclude}
                setTextToInclude={formState.setTextToInclude}
                elementsToAvoid={formState.elementsToAvoid}
                setElementsToAvoid={formState.setElementsToAvoid}
                referenceSketch={formState.referenceSketch}
                setReferenceSketch={formState.setReferenceSketch}
              />
              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !prompt.trim() || !isApiReady}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#333333] text-white font-semibold py-3 px-4 rounded-lg hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('app.generating')}
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    {creditText}
                  </>
                )}
              </button>
            </div>
        </div>
      </main>

      {user && (
        <DesignGallery 
          designs={designs}
          isLoading={isGalleryLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={fetchDesigns}
          onDownloadAll={handleDownloadAll}
          isDownloadingAll={isDownloadingAll}
        />
      )}

      <Footer />
      <StencilModal
        mode={style === TattooStyle.TSHIRT_DESIGN ? 'shield' : 'stencil'}
        isOpen={isSecondaryModalOpen}
        onClose={handleCloseSecondaryModal}
        onGenerate={handleGenerateSecondaryArt}
        stencilImage={secondaryImage}
        isStencilLoading={isSecondaryLoading}
        originalImageAlt={`${prompt} in ${style} style`}
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default App;