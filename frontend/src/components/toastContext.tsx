import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast from './toast';

interface ToastContextType {
    showToast: (message: string, status: 'success' | 'error' | 'warning' | 'info', delay?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<{ message: string; status: 'success' | 'error' | 'warning' | 'info'; delay: number } | null>(null);

    const showToast = useCallback((message: string, status: 'success' | 'error' | 'warning' | 'info', delay: number = 3000) => {
        setToast({ message, status, delay });
        setTimeout(() => setToast(null), delay);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && <Toast status={toast.status} delay={toast.delay}>{toast.message}</Toast>}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};