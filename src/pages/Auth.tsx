import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Title from 'templates/Title';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from 'modules/hooks';
import useErrorMessage from 'hooks/useErrorMessage';
import { login, register } from 'modules/user';

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;

const AuthBlock = styled.div`
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
  .link {
    align-self: end;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  color: ${({ theme }) => theme.letter_primary};
  background: ${({ theme }) => theme.primary};
  font-size: 1rem;
`;

type Authprops = {
  type: 'register' | 'login';
};

const Auth = ({ type }: Authprops) => {
  const { user, error } = useSelector(userSelector);
  const dispatch = useDispatch();
  const { onError, ErrorMessage } = useErrorMessage();
  const navigate = useNavigate();

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
    if (type === 'register') dispatch(register({ username, password }));
    else dispatch(login({ username, password }));
  };

  useEffect(() => {
    if (user.username) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      onError('로그인에 실패하였습니다.');
    }
  }, [error]);

  return (
    <AuthWrapper>
      <Title />
      <AuthBlock>
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
      </AuthBlock>
      <ErrorMessage />
    </AuthWrapper>
  );
};

export default Auth;
