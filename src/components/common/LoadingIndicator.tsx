import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { AiOutlineLoading } from 'react-icons/ai';

const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingIndicatorBlock = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 0.5rem;
  .indicator {
    font-size: 2rem;
    animation: ${rotating} 0.5s infinite linear;
  }
`;

const LoadingIndicator = () => {
  return (
    <LoadingIndicatorBlock>
      <AiOutlineLoading className="indicator" />
      <span>불러오는 중...</span>
    </LoadingIndicatorBlock>
  );
};

export default LoadingIndicator;
