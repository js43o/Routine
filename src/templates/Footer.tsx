import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { logout } from 'modules/user';
import { useNavigate } from 'react-router-dom';
import { userSelector } from 'modules/hooks';
import { persistor } from 'index';

const FooterBlock = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
`;

const TextButton = styled.div`
  color: ${({ theme }) => theme.letter_sub};
  text-decoration: underline;
  cursor: pointer;
`;

const Footer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(userSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.username) {
      navigate('/login');
    }
  }, [user.username]);

  const onLogout = async () => {
    try {
      await dispatch(logout());
      await persistor.purge();
    } catch (e) {
      if (e) {
        console.error(e);
      }
    }
  };

  return (
    <FooterBlock>
      <TextButton onClick={onLogout}>로그아웃</TextButton>
    </FooterBlock>
  );
};

export default Footer;
