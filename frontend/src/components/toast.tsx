import React from 'react';
import styled, { keyframes } from 'styled-components';

interface ToastProps {
    status: 'success' | 'error' | 'warning' | 'info';
    delay?: number;
    children: React.ReactNode;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastWrapper = styled.div<{ status: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  z-index: 9999;
  animation: ${slideIn} 0.3s ease-out;
  background-color: ${({ status }) => {
        switch (status) {
            case 'success': return '#4CAF50';
            case 'error': return '#F44336';
            case 'warning': return '#FFC107';
            case 'info': return '#2196F3';
            default: return '#333';
        }
    }};
`;
const Toast: React.FC<ToastProps> = ({ status, children }) => {
    return (
        <ToastWrapper status={status}>
            {children}
        </ToastWrapper>
    );
};

export default Toast;