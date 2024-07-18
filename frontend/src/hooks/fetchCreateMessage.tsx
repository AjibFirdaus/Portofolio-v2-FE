import { useState } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

interface MessageData {
  name: string;
  email: string;
  message: string;
}

const useCreateMessage = () => {
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const createMessage = async (newMessage: MessageData) => {
    setSending(true);
    setSendError('');
    try {
      const response = await axios.post(`${config}/api-create/createMessage`, newMessage);

      if (response.status === 200){
        setSendError('');
      } else {
        setSendError('An unknown error occurred status: ' + response.status);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSendError(error.message);
      } else {
        setSendError('An unknown error occurred');
      }
    } finally {
      setSending(false);
    }
  };

  return { createMessage, sending, sendError };
};

export default useCreateMessage;