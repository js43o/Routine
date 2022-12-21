import styled from '@emotion/styled';
import React from 'react';

type ButtonProps = {
  children?: React.ReactNode;
  [x: string]: unknown;
};

const ButtonBlock = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background: none;
  font-size: 1rem;
  cursor: pointer;
  @media (hover: hover) {
    &:hover {
      opacity: 0.75;
    }
  }
  &:active {
    opacity: 0.5;
  }
  margin: 0;
  padding: 0;
`;

const Button = ({ children, ...props }: ButtonProps) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ButtonBlock {...props}>{children}</ButtonBlock>;
};

Button.defaultProps = {
  children: null,
};

export default Button;
