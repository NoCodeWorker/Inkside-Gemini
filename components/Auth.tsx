import React, { useState } from 'react';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  type AuthProvider 
} from 'firebase/auth';
// FIX: Removed FirebaseError import which was causing a module resolution error.
// The error handling logic is updated to not depend on this type.
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, appleProvider } from '../services/firebase';
import { useTranslations } from '../i18n/useTranslations';
import { Logo } from './Logo';
import { GoogleIcon, AppleIcon } from './icons';
import { useNotifications } from '../hooks/useNotifications';

interface AuthProps {
  onSuccess?: (isNewUser: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const { t } = useTranslations();
  const { showNotification } = useNotifications();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const handleAuthError = (err: unknown) => {
    console.error("Firebase Auth Error:", err);
    let errorCode = 'default';
    // FIX: Replaced 'instanceof FirebaseError' with a type-safe structural check for the error code.
    // This avoids the FirebaseError import issue and correctly handles the 'unknown' type from the catch block.
    if (typeof err === 'object' && err !== null && 'code' in err && typeof (err as any).code === 'string') {
      errorCode = (err as any).code.replace('auth/', '');
    }
    showNotification(t(`errors.auth.${errorCode}`, {
      fallback: t('errors.auth.default')
    }));
  };

  const handleSocialSignIn = async (provider: AuthProvider) => {
    const providerId = provider.providerId.split('.')[0];
    setIsSocialLoading(providerId);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const isNewUser = !user.metadata.lastSignInTime || (user.metadata.creationTime === user.metadata.lastSignInTime);

      if (isNewUser && user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          credits: 5,
        });
      }
      onSuccess?.(isNewUser);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            credits: 5,
          });
        }
        onSuccess?.(true); // New user
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess?.(false); // Existing user
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const SocialButton: React.FC<{provider: AuthProvider, children: React.ReactNode, 'aria-label': string}> = ({ provider, children, 'aria-label': ariaLabel }) => {
    const providerId = provider.providerId.split('.')[0];
    return (
        <button
            type="button"
            onClick={() => handleSocialSignIn(provider)}
            disabled={!!isSocialLoading}
            aria-label={ariaLabel}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-inner hover:bg-gray-50 disabled:opacity-50 transition"
        >
            {isSocialLoading === providerId ? (
                <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                children
            )}
        </button>
    );
  };

  return (
    <div className="w-full">
        <div className="text-center">
            <Logo className="mx-auto h-16 w-auto" />
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                {isSignUp ? t('auth.signUpTitle') : t('auth.signInTitle')}
            </h2>
        </div>
        
        <div className="mt-8 space-y-4">
            <SocialButton provider={googleProvider} aria-label={t('auth.continueWithGoogle')}>
                <GoogleIcon className="w-5 h-5"/>
                <span className="text-sm font-medium text-gray-800">{t('auth.continueWithGoogle')}</span>
            </SocialButton>
            <SocialButton provider={appleProvider} aria-label={t('auth.continueWithApple')}>
                <AppleIcon className="w-5 h-5"/>
                <span className="text-sm font-medium text-gray-800">{t('auth.continueWithApple')}</span>
            </SocialButton>
        </div>

        <div className="my-6 flex items-center justify-center">
          <div className="w-full border-t border-gray-200"></div>
          <span className="px-4 text-xs font-medium text-gray-500 bg-white">{t('auth.separator')}</span>
          <div className="w-full border-t border-gray-200"></div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
            <div>
            <label htmlFor="email-address" className="sr-only">{t('auth.email')}</label>
            <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg placeholder-gray-500 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-800 transition-shadow sm:text-sm"
                placeholder={t('auth.email')}
            />
            </div>
            <div>
            <label htmlFor="password" className="sr-only">{t('auth.password')}</label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg placeholder-gray-500 text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-800 transition-shadow sm:text-sm"
                placeholder={t('auth.password')}
            />
            </div>
        </div>

        <div>
            <button
            type="submit"
            disabled={isLoading || !!isSocialLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 transition-colors"
            >
            {isLoading ? t('auth.loading') : (isSignUp ? t('auth.signUpButton') : t('auth.signInButton'))}
            </button>
        </div>
        </form>
        <div className="text-sm text-center mt-6">
        <button onClick={() => { setIsSignUp(!isSignUp); }} className="font-medium text-gray-600 hover:text-black transition-colors">
            {isSignUp ? t('auth.toggleToSignIn') : t('auth.toggleToSignUp')}
        </button>
        </div>
    </div>
  );
};

export default Auth;