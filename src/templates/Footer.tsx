import React from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { login } from 'modules/user';

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
  const dispatch = useDispatch();
  const onClick = async () => {
    try {
      await dispatch(login({ username: 'js43o', password: '123' }));
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <FooterBlock>
      <LogoutButton onClick={onClick}>Test data load</LogoutButton>
    </FooterBlock>
  );
};

export default Footer;
