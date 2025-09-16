import React from 'react';
import { useTranslations } from '../i18n/useTranslations';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, onPromptChange, isLoading }) => {
  const { t } = useTranslations();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="prompt-input" className="text-sm font-medium text-gray-700">
        {t('promptInput.label')}
      </label>
      <textarea
        id="prompt-input"
        rows={3}
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder={t('promptInput.placeholder')}
        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition placeholder-gray-400"
        disabled={isLoading}
      />
    </div>
  );
};

export default PromptInput;