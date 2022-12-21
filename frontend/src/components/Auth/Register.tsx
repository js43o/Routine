import React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { register } from 'modules/user';
import Button from 'components/common/Button';
import useAuth from 'hooks/useAuth';

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
      onError('입력값이 조건을 만족하지 않습니다.');
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
          <small>※ 영문 소문자/숫자/-/_ 포함 5-20자</small>
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
          <small>※ 영문 대소문자/숫자/특수문자 포함 8-20자</small>
        </label>
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
        <label htmlFor="nickname">
          닉네임
          <input
            type="text"
            id="nickname"
            maxLength={10}
            value={nickname}
            onChange={(e) => onChangeInput('nickname', e)}
          />
          <small>※ 한글/영문 대소문자/숫자 1-10자</small>
        </label>
        <Button type="submit" className="submit_button">
          계정 등록
        </Button>
      </form>
      <div className="auth_another">
        <span>계정이 있다면</span>
        <NavLink to="/login" className="link">
          로그인
        </NavLink>
      </div>
    </>
  );
};

export default Register;
