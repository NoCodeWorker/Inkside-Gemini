import React from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '../types';
import { Logo } from './Logo';
import { InstagramIcon, ShareIcon } from './icons';
import { useTranslations } from '../i18n/useTranslations';

interface HeaderProps {
  user: User | null;
  profile: UserProfile | null;
  guestCredits: number;
  onSignOut: () => void;
  onSignInClick: () => void;
  onBuyCreditsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, profile, guestCredits, onSignOut, onSignInClick, onBuyCreditsClick }) => {
  const { t, language, setLanguage } = useTranslations();

  const handleShareApp = async () => {
    const shareData = {
      title: t('share.appTitle'),
      text: t('share.appText'),
      url: 'https://inkside.app',
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert(t('share.appUrlCopied'));
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error al compartir la aplicación:', err);
        alert(t('errors.ui.shareFailed'));
      }
    }
  };

  const creditsToShow = user ? profile?.credits : guestCredits;
  const creditsText = user 
    ? t('header.credits', { count: creditsToShow ?? 0 }) 
    : t('header.guestCredits', { count: creditsToShow ?? 0 });

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Logo className="h-10 w-auto" />
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Info / Sign In Button */}
          {user && profile ? (
            <div className="hidden sm:flex items-center gap-4 border-l border-gray-200 ml-2 pl-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                <p className="text-xs text-gray-500">{creditsText}</p>
              </div>
              <button
                onClick={onBuyCreditsClick}
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
                >
                {t('header.buyCredits')}
              </button>
              <button
                onClick={onSignOut}
                className="text-sm text-gray-600 hover:text-black font-medium"
              >
                {t('header.signOut')}
              </button>
            </div>
          ) : (
             <div className="hidden sm:flex items-center gap-4 border-l border-gray-200 ml-2 pl-4">
                <p className="text-sm text-gray-600">{creditsText}</p>
                <button
                    onClick={onSignInClick}
                    className="text-sm font-semibold text-white bg-gray-800 hover:bg-black px-4 py-2 rounded-lg transition-colors"
                >
                    {t('header.signIn')}
                </button>
             </div>
          )}

          {/* Social and Language Controls */}
          <div className="flex items-center gap-2 border-l border-gray-200 ml-2 pl-2 sm:pl-4">
            <a
              href="https://www.instagram.com/inkside.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('header.instagramAria')}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
              <InstagramIcon className="w-6 h-6" />
            </a>
            <button
              onClick={handleShareApp}
              aria-label={t('header.shareAppAria')}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
              <ShareIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-sm font-medium border-l border-gray-200 ml-2 pl-2 sm:pl-4">
            <button 
              onClick={() => setLanguage('es')}
              className={`p-1 rounded transition-colors ${language === 'es' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
              aria-current={language === 'es'}
              title={t('header.switchToSpanish')}
            >
              ES
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => setLanguage('en')}
              className={`p-1 rounded transition-colors ${language === 'en' ? 'text-black font-bold' : 'text-gray-500 hover:text-black'}`}
              aria-current={language === 'en'}
              title={t('header.switchToEnglish')}
            >
              EN
            </button>
          </div>
        </div>
      </div>
       {/* Mobile User Info Bar */}
       <div className="sm:hidden container mx-auto flex items-center justify-end gap-4 mt-2 border-t border-gray-200 pt-2">
          {user && profile ? (
            <>
              <div className="text-right flex-grow">
                <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                <p className="text-xs text-gray-500">{creditsText}</p>
              </div>
              <button
                onClick={onBuyCreditsClick}
                className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
                >
                {t('header.buyCredits')}
              </button>
              <button
                onClick={onSignOut}
                className="text-sm text-gray-600 hover:text-black font-medium bg-gray-100 px-3 py-1 rounded-md"
              >
                {t('header.signOut')}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 flex-grow text-right">{creditsText}</p>
              <button
                onClick={onSignInClick}
                className="text-sm font-semibold text-white bg-gray-800 hover:bg-black px-3 py-1 rounded-lg transition-colors"
              >
                {t('header.signIn')}
              </button>
            </>
          )}
        </div>
    </header>
  );
};

export default Header;