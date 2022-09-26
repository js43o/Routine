import { useState } from 'react';

let timer: NodeJS.Timeout;

const useErrorMessage = () => {
  const [message, setMessage] = useState('');

  const onError = (str: string) => {
    if (message) return;

    setMessage(str);
    timer = setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  const resetError = () => {
    setMessage('');
    clearTimeout(timer);
  };

  return { message, onError, resetError };
};

export default useErrorMessage;
