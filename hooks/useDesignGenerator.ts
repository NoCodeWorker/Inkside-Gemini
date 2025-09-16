import { useState, useCallback } from 'react';
import { TattooStyle, ColorChoice } from '../types';
import { TATTOO_STYLES } from '../constants';
import { generateTattooDesign, generateTshirtDesign } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { useTranslations } from '../i18n/useTranslations';
import { useNotifications } from './useNotifications';
import { doc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';

const GUEST_CREDITS_KEY = 'inks-guest-credits';
const INITIAL_GUEST_CREDITS = 3;

export const useDesignGenerator = (onGenerationSuccess: () => void) => {
  const { user, userProfile, setUserProfile } = useAuth();
  const { t } = useTranslations();
  const { showNotification } = useNotifications();

  // Form state
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<TattooStyle>(TATTOO_STYLES[0]);
  const [bodyPart, setBodyPart] = useState('');
  const [sizeComplexity, setSizeComplexity] = useState('');
  const [tshirtColor, setTshirtColor] = useState('negra');
  const [tshirtPlacement, setTshirtPlacement] = useState('grande y centrado en la espalda');
  const [colorChoice, setColorChoice] = useState<ColorChoice>(ColorChoice.BLACK_AND_GREY);
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [accentColor, setAccentColor] = useState('');
  const [supportingElements, setSupportingElements] = useState('');
  const [mood, setMood] = useState('');
  const [composition, setComposition] = useState('');
  const [textToInclude, setTextToInclude] = useState('');
  const [elementsToAvoid, setElementsToAvoid] = useState('');
  const [referenceSketch, setReferenceSketch] = useState<File | null>(null);

  // UI/API State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guestCredits, setGuestCredits] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(GUEST_CREDITS_KEY) : null;
    return stored ? parseInt(stored, 10) : INITIAL_GUEST_CREDITS;
  });

  const handleStyleChange = (newStyle: TattooStyle) => {
    setStyle(newStyle);
    setGeneratedImage(null);
  };
  
  const handleGenerate = useCallback(async (
    openPurchaseModal: () => void, 
    openAuthModal: () => void
  ) => {
    if (!prompt.trim()) {
      showNotification(t('errors.ui.promptRequired'));
      return;
    }
    
    if (user) {
      if (userProfile && userProfile.credits < 1) {
        showNotification(t('errors.ui.notEnoughCredits'));
        openPurchaseModal();
        return;
      }
    } else {
      if (guestCredits < 1) {
        showNotification(t('errors.ui.guestCreditsDepleted'));
        openAuthModal();
        return;
      }
    }

    setIsLoading(true);
    setGeneratedImage(null);

    let colorPaletteString = '';
    switch (colorChoice) {
      case ColorChoice.BLACK_AND_GREY: colorPaletteString = 'Black and Grey tones only'; break;
      case ColorChoice.FULL_COLOR: colorPaletteString = colorPalette.length > 0 ? `A full color design using exclusively this color palette: ${colorPalette.join(', ')}` : 'A vibrant full color design'; break;
      case ColorChoice.ACCENT_COLOR: colorPaletteString = `Mainly Black and Grey with key accents of ${accentColor || 'red'}`; break;
    }

    try {
      let imageData: string;
      const mimeType = 'image/png';

      const commonParams = {
        mainElement: prompt, style, colorPalette: colorPaletteString, supportingElements,
        mood, composition, textToInclude, elementsToAvoid, referenceSketch,
      };

      if (style === TattooStyle.TSHIRT_DESIGN) {
        imageData = await generateTshirtDesign({ ...commonParams, tshirtColor, tshirtPlacement });
      } else {
        imageData = await generateTattooDesign({ ...commonParams, bodyPart, sizeComplexity });
      }
      
      const generatedImageDataUrl = `data:${mimeType};base64,${imageData}`;
      setGeneratedImage(generatedImageDataUrl);
      
      if (user) {
        const storageRef = ref(storage, `user-designs/${user.uid}/${new Date().getTime()}.png`);
        await uploadString(storageRef, generatedImageDataUrl, 'data_url');
        const downloadURL = await getDownloadURL(storageRef);

        const designsCollectionRef = collection(db, 'users', user.uid, 'designs');
        await addDoc(designsCollectionRef, { imageUrl: downloadURL, prompt, style, createdAt: Timestamp.now() });
        
        onGenerationSuccess(); // Triggers gallery refetch
      }
      
      if (user && userProfile) {
        const userDocRef = doc(db, 'users', user.uid);
        const newCredits = userProfile.credits - 1;
        await updateDoc(userDocRef, { credits: newCredits });
        setUserProfile(prev => prev ? { ...prev, credits: newCredits } : null);
      } else {
        const newGuestCredits = guestCredits - 1;
        setGuestCredits(newGuestCredits);
        localStorage.setItem(GUEST_CREDITS_KEY, newGuestCredits.toString());
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'errors.api.imageGenerationFailed';
      showNotification(t(errorMessage, { fallback: t('errors.api.imageGenerationFailed') }));
    } finally {
      setIsLoading(false);
    }
  }, [
    prompt, style, bodyPart, sizeComplexity, colorChoice, colorPalette, accentColor,
    supportingElements, mood, composition, textToInclude, elementsToAvoid,
    referenceSketch, t, user, userProfile, guestCredits, tshirtColor, tshirtPlacement,
    onGenerationSuccess, setUserProfile, showNotification
  ]);

  return {
    formState: {
        prompt, setPrompt, style, setStyle, bodyPart, setBodyPart, sizeComplexity,
        setSizeComplexity, tshirtColor, setTshirtColor, tshirtPlacement, setTshirtPlacement,
        colorChoice, setColorChoice, colorPalette, setColorPalette, accentColor, setAccentColor,
        supportingElements, setSupportingElements, mood, setMood, composition, setComposition,
        textToInclude, setTextToInclude, elementsToAvoid, setElementsToAvoid, referenceSketch,
        setReferenceSketch,
    },
    apiState: {
        generatedImage, isLoading, setGeneratedImage
    },
    creditsState: {
        guestCredits
    },
    handleGenerate,
    handleStyleChange
  };
};