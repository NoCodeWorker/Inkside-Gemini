import React, { useEffect, useState } from 'react';
import { XIcon } from './icons';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Animate in
    const timer = setTimeout(() => {
      handleClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [message, type]); // Rerun on new message

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Allow animation to finish
  };

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const iconColor = type === 'error' ? 'text-red-100' : 'text-green-100';

  return (
    <div 
      className={`fixed top-5 right-5 z-[100] transform transition-all duration-300 ease-in-out ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`flex items-center text-white p-4 rounded-lg shadow-lg ${bgColor} max-w-sm`}>
        <div className="flex-grow">
          <p className="font-bold">{type === 'error' ? 'Error' : 'Success'}</p>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={handleClose} className={`ml-4 p-1 rounded-full flex-shrink-0 hover:bg-black/20 ${iconColor}`} aria-label="Close notification">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;