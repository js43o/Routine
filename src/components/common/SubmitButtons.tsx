import styled from '@emotion/styled';
import React from 'react';
import Button from './Button';

const ButtonsBlock = styled.div`
  .submit {
    padding: 0.25rem 1rem;
    color: ${({ theme }) => theme.letter_primary};
    background: ${({ theme }) => theme.primary};
  }
  .close {
    padding: 0.25rem 1rem;
    background: ${({ theme }) => theme.background_sub};
    border: 1px solid ${({ theme }) => theme.border_main};
  }
`;

type SubmitButtonsType = {
  onSubmit: () => void;
  onClose: () => void;
};

export const SubmitButtons = ({ onSubmit, onClose }: SubmitButtonsType) => {
  return (
    <ButtonsBlock className="buttons">
      <Button className="submit" onClick={onSubmit}>
        추가
      </Button>
      <Button className="close" onClick={onClose}>
        취소
      </Button>
    </ButtonsBlock>
  );
};

export default SubmitButtons;
