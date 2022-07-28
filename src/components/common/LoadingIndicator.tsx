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

const LoadingIndicatorBlock = styled.div<{ white?: boolean }>`
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 0.5rem;
  color: ${({ white, theme }) => (white ? 'white' : theme.letter_main)};
  .indicator {
    font-size: 2rem;
    animation: ${rotating} 0.5s infinite linear;
  }
`;

type LoadingIndicatorProps = {
  white?: boolean;
};

const LoadingIndicator = ({ white }: LoadingIndicatorProps) => {
  return (
    <LoadingIndicatorBlock white={white}>
      <AiOutlineLoading className="indicator" />
      <span>불러오는 중...</span>
    </LoadingIndicatorBlock>
  );
};

LoadingIndicator.defaultProps = {
  white: null,
};

export default LoadingIndicator;
