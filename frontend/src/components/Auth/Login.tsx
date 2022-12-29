import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { login } from 'modules/user';
import Button from 'components/common/Button';
import useAuth from 'hooks/useAuth';

const KakaoLoginButton = styled(Button)`
  gap: 0.5rem;
  width: 100%;
  flex-grow: 1;
  padding: 0.5rem;
  color: black;
  background: #fee500;
  img {
    margin-top: 0.2rem;
    width: 1rem;
  }
`;

type LoginProps = {
  onError: (str: string) => void;
};

const Login = ({ onError }: LoginProps) => {
  const dispatch = useDispatch();
  const {
    state: { username, password, inputCondition },
    onChangeInput,
  } = useAuth();
  const { REACT_APP_KAKAO_API, REACT_APP_KAKAO_REDIRECT } = process.env;

  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      onError('아이디/비밀번호를 입력하세요.');
      return;
    }

    if (
      Object.values(inputCondition.username).includes(false) ||
      Object.values(inputCondition.password).includes(false)
    ) {
      onError('입력값을 확인해주세요.');
      return;
    }

    dispatch(login({ username, password }));
  };

  return (
    <>
      <form onSubmit={onLogin}>
        <label htmlFor="username">
          아이디
          <input
            type="text"
            id="username"
            maxLength={20}
            value={username}
            onChange={(e) => onChangeInput('username', e)}
          />
        </label>
        <label htmlFor="password">
          비밀번호
          <input
            type="password"
            id="password"
            maxLength={20}
            value={password}
            onChange={(e) => onChangeInput('password', e)}
          />
        </label>
        <Button type="submit" className="submit-button">
          로그인
        </Button>
      </form>
      <span className="or">───── 또는... ─────</span>
      <a
        href={`https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP_KAKAO_API}&redirect_uri=${REACT_APP_KAKAO_REDIRECT}&response_type=code`}
        className="kakao-login"
      >
        <KakaoLoginButton>
          <img
            src={`${process.env.PUBLIC_URL}/kakao.png`}
            alt="kakao_logo"
          ></img>
          <span>카카오 로그인</span>
        </KakaoLoginButton>
      </a>
      <div className="auth-switch">
        <span>계정이 없으신가요?</span>
        <Button aria-label="register page">
          <NavLink to="/register" className="link">
            계정 등록
          </NavLink>
        </Button>
      </div>
    </>
  );
};

export default Login;
