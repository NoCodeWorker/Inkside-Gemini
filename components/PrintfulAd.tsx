import React from 'react';
import { useTranslations } from '../i18n/useTranslations';
import { TshirtIcon } from './icons';

const PrintfulAd: React.FC = () => {
    const { t } = useTranslations();
    const printfulLink = "https://www.printful.com/a/2984519:a6a2a4e792ca2f85027a5950e309af25";

    return (
        <a
            href={printfulLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all items-center gap-4 text-center sm:text-left"
            aria-label={t('printfulAd.title')}
        >
            <TshirtIcon className="w-12 h-12 flex-shrink-0" />
            <div className="flex-grow">
                <h4 className="font-bold text-gray-800">{t('printfulAd.title')}</h4>
                <p className="text-sm text-gray-600 mt-1 sm:mt-0">{t('printfulAd.subtitle')}</p>
            </div>
            <div className="w-full sm:w-auto mt-3 sm:mt-0 flex-shrink-0 text-sm font-semibold bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-black transition-colors">
                {t('printfulAd.cta')}
            </div>
        </a>
    );
};

export default PrintfulAd;