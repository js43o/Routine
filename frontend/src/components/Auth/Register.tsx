import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { register } from 'modules/user';
import Button from 'components/common/Button';
import useAuth from 'hooks/useAuth';
import styled from '@emotion/styled';
import { BsCircle, BsCheckCircle } from 'react-icons/bs';

const InputCheckerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.letter_sub};
`;

const InputChecker = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const UncheckedCircle = styled(BsCircle)``;

const CheckedCircle = styled(BsCheckCircle)`
  color: ${({ theme }) => theme.primary};
`;

type RegisterProps = {
  onError: (str: string) => void;
};

const Register = ({ onError }: RegisterProps) => {
  const dispatch = useDispatch();
  const {
    state: { username, password, passwordConfirm, nickname, inputCondition },
    onChangeInput,
  } = useAuth();

  const onRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      Object.values(inputCondition.username).includes(false) ||
      Object.values(inputCondition.password).includes(false) ||
      Object.values(inputCondition.nickname).includes(false)
    ) {
      onError('입력값을 확인해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      onError('비밀번호가 일치하지 않습니다.');
      return;
    }

    dispatch(register({ username, password, nickname }));
  };

  return (
    <>
      <form onSubmit={onRegister}>
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
        <InputCheckerWrapper>
          <InputChecker>
            {inputCondition.username.allowedCharacter ? (
              <CheckedCircle />
            ) : (
              <UncheckedCircle />
            )}
            영문 소문자, 숫자, (-), (_) 허용
          </InputChecker>
          <InputChecker>
            {inputCondition.username.allowedLength ? (
              <CheckedCircle />
            ) : (
              <UncheckedCircle />
            )}
            5-20자 이내
          </InputChecker>
        </InputCheckerWrapper>
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
        <InputCheckerWrapper>
          <InputChecker>
            {inputCondition.password.allowedCharacter ? (
              <CheckedCircle />
            ) : (
              <UncheckedCircle />
            )}
            영문 대소문자, 숫자, 특수문자 포함
          </InputChecker>
          <InputChecker>
            {inputCondition.password.allowedLength ? (
              <CheckedCircle />
            ) : (
              <UncheckedCircle />
            )}
            8-20자 이내
          </InputChecker>
        </InputCheckerWrapper>
        <label htmlFor="passwordConfirm">
          비밀번호 재확인
          <input
            type="password"
            id="passwordConfirm"
            maxLength={20}
            value={passwordConfirm}
            onChange={(e) => onChangeInput('passwordConfirm', e)}
          />
        </label>
        <InputCheckerWrapper>
          <InputChecker>
            {passwordConfirm && passwordConfirm === password ? (
              <CheckedCircle />
            ) : (
              <UncheckedCircle />
            )}
            비밀번호 일치
          </InputChecker>
        </InputCheckerWrapper>
        <label htmlFor="nickname">
          닉네임
          <input
            type="text"
            id="nickname"
            maxLength={10}
            value={nickname}
            onChange={(e) => onChangeInput('nickname', e)}
          />
        </label>
        <InputCheckerWrapper>
          <InputChecker>
            {inputCondition.nickname.allowedCharacter ? (
              <CheckedCircle />
            ) : (
              <UncheckedCircle />
            )}
            한글, 영문 대소문자, 숫자 허용
          </InputChecker>
          <InputChecker>
            {inputCondition.nickname.allowedLength ? (
              <CheckedCircle />
            ) : (
              <UncheckedCircle />
            )}
            1-10자 이내
          </InputChecker>
        </InputCheckerWrapper>
        <Button type="submit" className="submit-button">
          계정 등록
        </Button>
      </form>
      <div className="auth-switch">
        <span>계정이 있다면...</span>
        <Button aria-label="login page">
          <NavLink to="/login" className="link">
            로그인
          </NavLink>
        </Button>
      </div>
    </>
  );
};

export default Register;
