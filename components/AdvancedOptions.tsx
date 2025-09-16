import React, { useRef } from 'react';
import { useTranslations } from '../i18n/useTranslations';
import { ColorChoice, TattooStyle } from '../types';
import ColorPalettePicker from './ColorPalettePicker';

interface AdvancedOptionsProps {
  selectedStyle: TattooStyle;
  // Tattoo props
  bodyPart: string;
  setBodyPart: (value: string) => void;
  sizeComplexity: string;
  setSizeComplexity: (value: string) => void;
  // T-shirt props
  tshirtColor: string;
  setTshirtColor: (value: string) => void;
  tshirtPlacement: string;
  setTshirtPlacement: (value: string) => void;
  // Common props
  colorChoice: ColorChoice;
  setColorChoice: (value: ColorChoice) => void;
  colorPalette: string[];
  setColorPalette: (palette: string[]) => void;
  accentColor: string;
  setAccentColor: (value: string) => void;
  supportingElements: string;
  setSupportingElements: (value: string) => void;
  mood: string;
  setMood: (value: string) => void;
  composition: string;
  setComposition: (value: string) => void;
  textToInclude: string;
  setTextToInclude: (value: string) => void;
  elementsToAvoid: string;
  setElementsToAvoid: (value: string) => void;
  referenceSketch: File | null;
  setReferenceSketch: (file: File | null) => void;
}

// Moved helper components outside the main component to prevent re-creation on render,
// which was causing the input fields to lose focus.
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="flex flex-col gap-4 pl-2 border-l-2 border-gray-200 ml-1">
      {children}
    </div>
  </div>
);

const TextInput: React.FC<{ id: string; label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, placeholder, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <input id={id} type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400" />
  </div>
);

const TextArea: React.FC<{ id: string; label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> = ({ id, label, placeholder, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <textarea id={id} rows={2} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition placeholder-gray-400" />
  </div>
);

const AdvancedOptions: React.FC<AdvancedOptionsProps> = (props) => {
  const { t } = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      props.setReferenceSketch(file);
    }
  };

  const handleClearFile = () => {
    props.setReferenceSketch(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const TattooFields = () => (
    <>
      <FormSection title={t('designForm.sectionPlacement')}>
        <TextInput id="body-part" label={t('designForm.bodyPartLabel')} placeholder={t('designForm.bodyPartPlaceholder')} value={props.bodyPart} onChange={(e) => props.setBodyPart(e.target.value)} />
        <TextInput id="size-complexity" label={t('designForm.sizeComplexityLabel')} placeholder={t('designForm.sizeComplexityPlaceholder')} value={props.sizeComplexity} onChange={(e) => props.setSizeComplexity(e.target.value)} />
      </FormSection>
    </>
  );

  const TshirtFields = () => (
    <>
      <FormSection title={t('designForm.sectionPlacement')}>
        <TextInput id="tshirt-color" label={t('designForm.tshirtColorLabel')} placeholder={t('designForm.tshirtColorPlaceholder')} value={props.tshirtColor} onChange={(e) => props.setTshirtColor(e.target.value)} />
        <TextInput id="tshirt-placement" label={t('designForm.tshirtPlacementLabel')} placeholder={t('designForm.tshirtPlacementPlaceholder')} value={props.tshirtPlacement} onChange={(e) => props.setTshirtPlacement(e.target.value)} />
      </FormSection>
    </>
  );


  return (
    <div className="flex flex-col gap-6 border-t border-gray-200 pt-4">
      
      {props.selectedStyle === TattooStyle.TSHIRT_DESIGN ? <TshirtFields /> : <TattooFields />}

      <FormSection title={t('designForm.sectionArtistic')}>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">{t('designForm.colorPaletteLabel')}</label>
          <div className="flex flex-col gap-2 pt-1">
            {(Object.keys(ColorChoice) as Array<keyof typeof ColorChoice>).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer">
                <input type="radio" name="color-choice" value={ColorChoice[key]} checked={props.colorChoice === ColorChoice[key]} onChange={(e) => props.setColorChoice(e.target.value as ColorChoice)} className="w-4 h-4 accent-[#900029] bg-gray-100 border-gray-300 focus:ring-[#900029]" />
                {t(`designForm.${ColorChoice[key]}`)}
              </label>
            ))}
          </div>
          {props.colorChoice === ColorChoice.FULL_COLOR && (
            <ColorPalettePicker 
              palette={props.colorPalette}
              setPalette={props.setColorPalette}
            />
          )}
          {props.colorChoice === ColorChoice.ACCENT_COLOR && (
             <input type="text" value={props.accentColor} onChange={(e) => props.setAccentColor(e.target.value)} placeholder={t('designForm.accentColorPlaceholder')} className="w-full mt-2 bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400" />
          )}
        </div>
        <TextArea id="supporting-elements" label={t('designForm.supportingElementsLabel')} placeholder={t('designForm.supportingElementsPlaceholder')} value={props.supportingElements} onChange={(e) => props.setSupportingElements(e.target.value)} />
        <TextInput id="mood" label={t('designForm.moodLabel')} placeholder={t('designForm.moodPlaceholder')} value={props.mood} onChange={(e) => props.setMood(e.target.value)} />
        <TextArea id="composition" label={t('designForm.compositionLabel')} placeholder={t('designForm.compositionPlaceholder')} value={props.composition} onChange={(e) => props.setComposition(e.target.value)} />
      </FormSection>

      <FormSection title={t('designForm.sectionInclusions')}>
        <div className="flex flex-col gap-1">
          <label htmlFor="reference-sketch-button" className="text-sm font-medium text-gray-700">{t('designForm.referenceSketchLabel')}</label>
          <input id="reference-sketch-file" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          {!props.referenceSketch ? (
            <button id="reference-sketch-button" onClick={triggerFileInput} className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition">
              {t('designForm.referenceSketchButton')}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 pl-3 text-sm">
              <span className="text-gray-700 truncate pr-2 font-medium">{props.referenceSketch.name}</span>
              <button onClick={handleClearFile} className="text-gray-500 hover:text-red-600 font-bold text-lg p-1" aria-label={t('designForm.referenceSketchRemoveAria')}>&times;</button>
            </div>
          )}
        </div>
        <TextInput id="text-to-include" label={t('designForm.textToIncludeLabel')} placeholder={t('designForm.textToIncludePlaceholder')} value={props.textToInclude} onChange={(e) => props.setTextToInclude(e.target.value)} />
        <TextInput id="elements-to-avoid" label={t('designForm.elementsToAvoidLabel')} placeholder={t('designForm.elementsToAvoidPlaceholder')} value={props.elementsToAvoid} onChange={(e) => props.setElementsToAvoid(e.target.value)} />
      </FormSection>
    </div>
  );
};

export default AdvancedOptions;