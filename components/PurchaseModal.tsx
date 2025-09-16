import React from 'react';
import type { User } from 'firebase/auth';
import { useTranslations } from '../i18n/useTranslations';
import { XIcon, SparklesIcon } from './icons';
import { Logo } from './Logo';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, user }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;
  
  // !!! IMPORTANT: Replace with your actual Stripe Payment Link !!!
  // To pass the user ID to Stripe and get it back in the webhook, create your link like this:
  // https://buy.stripe.com/your_link_id?client_reference_id={{USER_ID}}
  // Then replace the placeholder below.
  const baseStripeLink = "https://buy.stripe.com/bJe00i4ff7UQb4p9LO5Rm00";
  
  // Append the user's UID to the link to identify them in Stripe
  const stripeLink = user ? `${baseStripeLink}?client_reference_id=${user.uid}` : baseStripeLink;


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="purchase-modal-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale p-8 text-center" 
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

        <Logo className="mx-auto h-16 w-auto mb-4" />

        <h2 id="purchase-modal-title" className="text-2xl font-bold text-gray-900">
          {t('purchase.title')}
        </h2>
        <p className="mt-2 text-gray-600">{t('purchase.subtitle')}</p>

        <div className="my-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">{t('purchase.offer')}</p>
            <p className="text-lg text-gray-600">{t('purchase.price')}</p>
        </div>

        <div className="flex flex-col gap-3">
            <a
                href={stripeLink}
                className="w-full flex items-center justify-center gap-2 bg-[#333333] text-white font-semibold py-3 px-4 rounded-lg hover:bg-black transition-colors duration-200"
            >
                <SparklesIcon className="w-5 h-5" />
                {t('purchase.button')}
            </a>
            <button
                onClick={onClose}
                className="w-full text-sm text-gray-600 hover:text-black font-medium py-2 rounded-lg"
            >
                {t('purchase.noThanks')}
            </button>
        </div>

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

export default PurchaseModal;