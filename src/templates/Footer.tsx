import styled from '@emotion/styled';
import React from 'react';
import useAuth from 'hooks/useAuth';

const FooterBlock = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const LogoutButton = styled.div`
  color: ${({ theme }) => theme.letter_sub};
  cursor: pointer;
`;

const Footer = () => {
  const { register, login } = useAuth();
  const onClick = async () => {
    await login('js43o', '123');
  };
  return (
    <FooterBlock>
      <LogoutButton onClick={onClick}>Test data load</LogoutButton>
    </FooterBlock>
  );
};

export default Footer;
