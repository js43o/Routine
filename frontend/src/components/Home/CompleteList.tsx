import React from 'react';
import styled from '@emotion/styled';
import { CompleteItem } from 'types';

const CompleteListBlock = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  position: absolute;
  z-index: 10;
  max-height: 160px;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  color: ${({ theme }) => theme.letter_main};
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(2rem);
  & > .date {
    font-weight: bold;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid ${({ theme }) => theme.border_main};
  }
  & > .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: normal;
    font-size: 0.85rem;
    overflow-y: scroll;
  }
`;

type CompleteListProps = {
  complete: CompleteItem | null;
  visible: boolean;
};

const CompleteList = ({ complete, visible }: CompleteListProps) => {
  return (
    <CompleteListBlock visible={!!(complete && visible)}>
      <div className="date">{complete?.date}</div>
      <div className="content">
        {complete?.list.map((exer) => (
          <span key={exer.exercise}>{exer.exercise}</span>
        ))}
      </div>
    </CompleteListBlock>
  );
};

export default CompleteList;
