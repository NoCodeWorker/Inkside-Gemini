import React, { useState, useRef } from 'react';
import { useTranslations } from '../i18n/useTranslations';

interface ColorPalettePickerProps {
  palette: string[];
  setPalette: (palette: string[]) => void;
}

const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({ palette, setPalette }) => {
  const { t } = useTranslations();
  const [currentColor, setCurrentColor] = useState('#000000');
  const colorInputRef = useRef<HTMLInputElement>(null);

  const addColor = () => {
    if (currentColor && !palette.includes(currentColor) && palette.length < 8) {
      setPalette([...palette, currentColor]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    setPalette(palette.filter(color => color !== colorToRemove));
  };

  const triggerColorPicker = () => {
    colorInputRef.current?.click();
  };

  return (
    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <label className="text-sm font-medium text-gray-700">{t('designForm.colorPickerLabel')}</label>
      <div className="flex items-center gap-2 mt-2">
        <div 
          onClick={triggerColorPicker} 
          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
          style={{ backgroundColor: currentColor }}
          aria-label="Color picker"
        >
          <input
            ref={colorInputRef}
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="opacity-0 w-0 h-0"
          />
        </div>
        <input
          type="text"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-24 bg-white border border-gray-300 rounded-md p-1 text-sm text-center"
          aria-label="Current color hex"
        />
        <button
          type="button"
          onClick={addColor}
          className="flex-grow bg-white border border-gray-300 text-gray-700 text-sm font-medium py-1 px-3 rounded-md hover:bg-gray-100 transition"
        >
          {t('designForm.addColor')}
        </button>
      </div>

      {palette.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-600 mb-2">{t('designForm.selectedColors')}</p>
          <div className="flex flex-wrap gap-2">
            {palette.map((color, index) => (
              <div key={index} className="relative group">
                <div
                  className="w-8 h-8 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                ></div>
                <button
                  onClick={() => removeColor(color)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${color}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalettePicker;