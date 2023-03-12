import React from 'react';
import styled from '@emotion/styled';
import Button from './Button';

const ButtonsBlock = styled.div`
  button {
    padding: 0.25rem 0.5rem;
    width: 4rem;
  }
  .submit {
    color: ${({ theme }) => theme.letter_primary};
    background: ${({ theme }) => theme.primary};
  }
  .close {
    background: ${({ theme }) => theme.background_main};
    border: 1px solid ${({ theme }) => theme.border_main};
  }
`;

type SubmitButtonsType = {
  onClose: () => void | null;
};

export const SubmitButtons = ({ onClose }: SubmitButtonsType) => {
  return (
    <ButtonsBlock className="buttons">
      <Button type="submit" className="submit">
        추가
      </Button>
      <Button type="button" className="close" onClick={onClose}>
        취소
      </Button>
    </ButtonsBlock>
  );
};

export default SubmitButtons;
