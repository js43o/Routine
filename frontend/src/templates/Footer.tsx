import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { deregister, kakaoDeregister, kakaoLogout, logout } from 'modules/user';
import { useNavigate } from 'react-router-dom';
import { userSelector } from 'modules/hooks';
import { persistor } from 'index';

const FooterBlock = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem;
  color: ${({ theme }) => theme.letter_sub};
  .buttons {
    display: flex;
  }
`;

const TextButton = styled.div`
  padding: 0 0.5rem;
  color: ${({ theme }) => theme.letter_main};
  text-decoration: underline;
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
      {user.snsProvider === 'kakao' ? (
        <i>카카오로 로그인 중</i>
      ) : (
        <i>
          <b>{user.username}</b>으로 로그인 중
        </i>
      )}
      <div className="buttons">
        <TextButton onClick={onLogout}>로그아웃</TextButton>
        <TextButton className="deregister" onClick={onDeregister}>
          계정 삭제
        </TextButton>
      </div>
    </FooterBlock>
  );
};

export default Footer;
