import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import styled from '@emotion/styled';
import { userSelector } from 'modules/hooks';
import Title from 'templates/Title';
import useErrorMessage from 'hooks/useErrorMessage';
import { login, register } from 'modules/user';
import Button from 'components/common/Button';
import { validateAuth } from 'lib/methods';

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;

const AuthBlock = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: ${({ type }) => type === 'register' && '20rem'};
  }
  .link {
    align-self: end;
  }
`;

const KakaoLoginButton = styled(Button)`
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  color: black;
  background: ${({ theme }) => theme.yellow};
  img {
    margin-top: 0.2rem;
    width: 1rem;
  }
`;

const SubmitButton = styled(Button)`
  padding: 0.5rem;
  color: ${({ theme }) => theme.letter_primary};
  background: ${({ theme }) => theme.primary};
`;

type Authprops = {
  type: 'register' | 'login';
};

const Auth = ({ type }: Authprops) => {
  const { user, error } = useSelector(userSelector);
  const dispatch = useDispatch();
  const { onError, ErrorMessage } = useErrorMessage();
  const navigate = useNavigate();
  const { REACT_APP_KAKAO_API, REACT_APP_KAKAO_REDIRECT } = process.env;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (field === 'username') {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === 'register') {
      if (!validateAuth(username, 'id') || !validateAuth(password, 'pw')) {
        onError('입력값이 조건을 충족하지 않습니다.');
        return;
      }
      dispatch(register({ username, password }));
    } else {
      dispatch(login({ username, password }));
    }
  };

  useEffect(() => {
    if (user.username) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    if (!error) return;

    if (type === 'login') {
      onError('로그인에 실패하였습니다.');
    } else {
      onError('잠시 후 다시 시도해주세요.');
    }
  }, [error]);

  return (
    <AuthWrapper>
      <Title />
      <AuthBlock type={type}>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            id="username"
            placeholder={
              type === 'login' ? '아이디' : '아이디 (영문/숫자 5-20자)'
            }
            maxLength={20}
            onChange={(e) => onChange(e, 'username')}
          />
          <input
            type="password"
            id="password"
            placeholder={
              type === 'login'
                ? '패스워드'
                : '패스워드 (영문/숫자/특수문자 8-20자)'
            }
            maxLength={20}
            onChange={(e) => onChange(e, 'password')}
          />
          <SubmitButton type="submit">
            {type === 'register' ? '계정 등록' : '로그인'}
          </SubmitButton>
        </form>
        <NavLink
          to={type === 'register' ? '/login' : '/register'}
          className="link"
        >
          {type === 'register' ? '로그인 ▶' : '계정 등록 ▶'}
        </NavLink>
        {type === 'login' && (
          <a
            href={`https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP_KAKAO_API}&redirect_uri=${REACT_APP_KAKAO_REDIRECT}&response_type=code`}
          >
            <KakaoLoginButton>
              <img
                src={`${process.env.PUBLIC_URL}/kakao.png`}
                alt="kakao_logo"
              ></img>
              <span>카카오 로그인</span>
            </KakaoLoginButton>
          </a>
        )}
      </AuthBlock>
      <ErrorMessage />
    </AuthWrapper>
  );
};

export default Auth;
