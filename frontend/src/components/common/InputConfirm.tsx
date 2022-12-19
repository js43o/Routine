import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

const InputConfirmBlock = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.5rem;
  & > div {
    display: flex;
    flex-direction: column;
    place-items: center;
    flex-grow: 1;
    .count {
      font-size: 1.5rem;
      width: 4.25rem;
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

type InputConfirmProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

const InputConfirm = ({ onSubmit, children }: InputConfirmProps) => {
  return <InputConfirmBlock onSubmit={onSubmit}>{children}</InputConfirmBlock>;
};

export default InputConfirm;
