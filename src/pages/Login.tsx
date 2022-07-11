import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import Button from 'components/common/Button';
import { Navigate, NavLink } from 'react-router-dom';
import Title from 'templates/Title';
import { login } from 'modules/user';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from 'modules/hooks';
import ErrorMessage from 'components/common/ErrorMessage';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;

const LoginBlock = styled.div`
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
    input {
      font-size: 1rem;
    }
  }
  #register {
    align-self: end;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  color: ${({ theme }) => theme.letter_primary};
  background: ${({ theme }) => theme.primary};
`;

const Login = () => {
  const { user, error } = useSelector(userSelector);
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'username') {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  if (user.username) return <Navigate to="/" />;

  return (
    <LoginWrapper>
      <Title />
      <LoginBlock>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            id="username"
            placeholder="아이디"
            maxLength={20}
            onChange={(e) => onChange(e, 'username')}
          />
          <input
            type="password"
            id="password"
            placeholder="패스워드"
            maxLength={20}
            onChange={(e) => onChange(e, 'password')}
          />
          <SubmitButton type="submit">로그인</SubmitButton>
        </form>
        <NavLink to="/register" id="register">
          계정 등록 ▶
        </NavLink>
      </LoginBlock>
      <ErrorMessage message={error ? '로그인에 실패하였습니다.' : ''} />
    </LoginWrapper>
  );
};

export default Login;
