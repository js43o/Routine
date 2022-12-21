import React from 'react';
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
  min-height: 2rem;
  color: red;
  &.shaking {
    animation: ${shaking} linear 0.1s 0s 3;
  }
`;

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <ErrorMessageBlock className={`error-message${message && ' shaking'}`}>
      {message}
    </ErrorMessageBlock>
  );
};

export default ErrorMessage;
