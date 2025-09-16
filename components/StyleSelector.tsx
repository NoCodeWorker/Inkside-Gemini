import React from 'react';
import { TattooStyle } from '../types';
import { useTranslations } from '../i18n/useTranslations';
import { TATTOO_STYLES } from '../constants';

interface StyleSelectorProps {
  selectedStyle: TattooStyle;
  onStyleChange: (style: TattooStyle) => void;
  styles: TattooStyle[];
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange, styles }) => {
  const { t } = useTranslations();
  
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="style-selector" className="text-sm font-medium text-gray-700">
        {t('styleSelector.label')}
      </label>
      <div className="relative">
        <select
          id="style-selector"
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value as TattooStyle)}
          className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
        >
          {TATTOO_STYLES.map((style) => (
            <option key={style} value={style}>
              {t(`tattooStyles.${style}`)}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;