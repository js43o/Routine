import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { check, logout } from 'modules/user';
import { useNavigate } from 'react-router-dom';
import { userSelector } from 'modules/hooks';

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
      await dispatch(check());
    } catch (e) {
      if (e) {
        console.error(e);
      }
    }
  };

  const onCheck = async () => {
    try {
      await dispatch(check());
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <FooterBlock>
      <TextButton onClick={onLogout}>로그아웃</TextButton>
      <TextButton onClick={onCheck}>로그인 체크</TextButton>
    </FooterBlock>
  );
};

export default Footer;
