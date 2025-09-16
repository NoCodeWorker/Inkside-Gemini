import React from 'react';
import { InstagramIcon } from './icons';
import { useTranslations } from '../i18n/useTranslations';

const Footer: React.FC = () => {
  const { t } = useTranslations();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-transparent border-t border-gray-200 mt-8 py-6 px-4">
      <div className="container mx-auto text-center text-sm text-gray-500 space-y-4">
        <a 
          href="https://www.instagram.com/inkside.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 hover:text-gray-800 transition-colors"
        >
          <InstagramIcon className="w-5 h-5" />
          <span>{t('footer.followInstagram')}</span>
        </a>
        <div>
          <p>
            &copy; {currentYear} {t('footer.copyright')}
          </p>
          <p>
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;