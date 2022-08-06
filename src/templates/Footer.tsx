import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { deregister, kakaoDeregister, kakaoLogout, logout } from 'modules/user';
import { useNavigate } from 'react-router-dom';
import { userSelector } from 'modules/hooks';
import { persistor } from 'index';

const FooterBlock = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const TextButton = styled.div`
  color: ${({ theme }) => theme.letter_sub};
  text-decoration: underline;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  &.deregister {
    color: ${({ theme }) => theme.red};
  }
  & + & {
    border-left: 1px solid ${({ theme }) => theme.border_main};
  }
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

  const onLogout = () => {
    if (user.snsProvider === 'kakao') {
      dispatch(kakaoLogout());
    }
    dispatch(logout());
    persistor.purge();
  };

  const onDeregister = () => {
    if (
      !window.confirm(
        '삭제한 계정은 복구할 수 없습니다.\n정말 삭제하시겠습니까?',
      )
    )
      return;
    if (user.snsProvider === 'kakao') {
      dispatch(kakaoDeregister());
    }
    dispatch(deregister({ username: user.username }));
    dispatch(logout());
    persistor.purge();
  };

  return (
    <FooterBlock>
      <TextButton onClick={onLogout}>로그아웃</TextButton>
      <TextButton className="deregister" onClick={onDeregister}>
        계정 삭제
      </TextButton>
    </FooterBlock>
  );
};

export default Footer;
