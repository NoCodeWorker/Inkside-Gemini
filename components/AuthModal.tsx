import React from 'react';
import Auth from './Auth';
import { useTranslations } from '../i18n/useTranslations';
import { XIcon } from './icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (isNewUser: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale p-8 sm:p-10" 
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" 
          aria-label={t('authModal.closeAria')}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <Auth onSuccess={onSuccess} />
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

export default AuthModal;