import React, { createContext, useState, useCallback } from 'react';
import Toast, { ToastType } from '../components/Toast';

interface NotificationContextType {
  showNotification: (message: string, type?: ToastType) => void;
}

interface NotificationState {
  message: string;
  type: ToastType;
  key: number;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback((message: string, type: ToastType = 'error') => {
    setNotification({ message, type, key: Date.now() });
  }, []);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Toast
          key={notification.key}
          message={notification.message}
          type={notification.type}
          onClose={handleClose}
        />
      )}
    </NotificationContext.Provider>
  );
};