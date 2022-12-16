import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import LoadingIndicator from 'components/common/LoadingIndicator';
import { useDispatch, useSelector } from 'react-redux';
import { kakaoLogin } from 'modules/user';
import { userSelector } from 'modules/hooks';
import { useNavigate } from 'react-router-dom';

const KakaoBlock = styled.div`
  display: flex;
  place-items: center;
`;

const Kakao = () => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    if (code) {
      localStorage.setItem('code', code);
      dispatch(kakaoLogin({ code }));
    }
  }, []);

  useEffect(() => {
    if (user.username) {
      navigate('/');
    }
  }, [user]);

  return (
    <KakaoBlock>
      <LoadingIndicator />
    </KakaoBlock>
  );
};

export default Kakao;
