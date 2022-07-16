import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const shaking = keyframes`
  from {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  to {
    transform: translateX(0);
  }
`;

const ErrorMessageBlock = styled.div`
  display: flex;
  place-items: center;
  color: red;
  height: 1rem;
  margin-bottom: 0.25rem;
  &.shaking {
    animation: ${shaking} linear 0.1s 0s 3;
  }
`;

const useErrorMessage = () => {
  const [error, setError] = useState('');

  const onError = (message: string) => {
    if (error) return;
    setError(message);
    setTimeout(() => setError(''), 2000);
  };

  const ErrorMessage = () => (
    <ErrorMessageBlock className={error && 'shaking'}>
      {error}
    </ErrorMessageBlock>
  );

  return { error, onError, ErrorMessage };
};

export default useErrorMessage;
