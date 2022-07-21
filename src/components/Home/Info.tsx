import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { setInfo } from 'modules/user';
import { User } from 'types';
import { FaPencilAlt } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs';
import Button from 'components/common/Button';
import { getDatestr } from 'lib/methods';
import useErrorMessage from 'hooks/useErrorMessage';

const InfoBlock = styled.div<{ editing: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 1px solid
    ${({ editing, theme }) => (editing ? theme.primary : theme.border_main)};
  border-radius: 0.5rem;
  transition: border 0.2s;
  input {
    max-width: 9rem;
    border: none;
    border-radius: 0.25rem;
    margin-left: 0.25rem;
    font-size: 1rem;
  }
`;

const EditButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  margin: 0;
  font-size: 1.5rem;
`;

const CheckButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem;
  margin: 0;
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
`;

type InputState = {
  name: string;
  gender: string;
  birth: string;
  height: string;
};

type InputAction = {
  type: string;
  payload: string;
};

const reducer = (state: InputState, action: InputAction) => {
  switch (action.type) {
    case 'NAME':
      return { ...state, name: action.payload };
    case 'GENDER':
      return { ...state, gender: action.payload };
    case 'BIRTH':
      return { ...state, birth: action.payload };
    case 'HEIGHT':
      return { ...state, height: action.payload };
    default:
      return state;
  }
};

type InfoBlockProps = {
  user: User;
};

const Info = ({ user }: InfoBlockProps) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [inputState, inputDispatch] = useReducer(reducer, {
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    height: `${user.height}`,
  });
  const { onError, ErrorMessage } = useErrorMessage();

  const onToggleEditing = () => {
    setEditing(!editing);
    onError('');
  };

  const onChange = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'HEIGHT' && e.target.value.length > 3) return;
    inputDispatch({
      type,
      payload: e.target.value,
    });
  };

  const onToggleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputDispatch({ type: 'GENDER', payload: e.target.value });
  };

  const onSubmit = async () => {
    if (
      !inputState.name ||
      !inputState.gender ||
      inputState.birth.length < 8 ||
      +inputState.height < 100
    ) {
      onError('입력값을 확인해주세요');
      return;
    }
    dispatch(
      setInfo({
        username: user.username,
        name: inputState.name,
        gender: inputState.gender,
        birth: inputState.birth,
        height: +inputState.height,
      }),
    );
    onToggleEditing();
    onError('');
  };

  useEffect(() => {
    inputDispatch({ type: 'NAME', payload: user.name });
    inputDispatch({ type: 'BIRTH', payload: user.birth });
    inputDispatch({ type: 'GENDER', payload: user.gender });
    inputDispatch({ type: 'HEIGHT', payload: `${user.height}` });
  }, [user]);

  return (
    <InfoBlock editing={editing}>
      {editing ? (
        <>
          <CheckButton onClick={onSubmit}>
            <BsCheckLg />
          </CheckButton>
          <div>
            이름:
            <input
              type="text"
              value={inputState.name}
              onChange={(e) => onChange('NAME', e)}
              maxLength={8}
              required
            />
          </div>
          <div>
            성별:
            <label htmlFor="male">
              <input
                id="male"
                type="radio"
                value="남성"
                checked={inputState.gender === '남성'}
                onChange={onToggleRadio}
              />
              남성
            </label>
            <label htmlFor="female">
              <input
                id="female"
                type="radio"
                value="여성"
                checked={inputState.gender === '여성'}
                onChange={onToggleRadio}
              />
              여성
            </label>
          </div>
          <div>
            생년월일:
            <input
              type="date"
              value={inputState.birth}
              onChange={(e) => onChange('BIRTH', e)}
              min="1900-01-01"
              max={getDatestr(new Date())}
              required
            />
          </div>
          <div>
            키:
            <input
              type="number"
              value={inputState.height}
              onChange={(e) => onChange('HEIGHT', e)}
              min={100}
              max={300}
              required
            />
            cm
          </div>
        </>
      ) : (
        <>
          <EditButton onClick={onToggleEditing}>
            <FaPencilAlt />
          </EditButton>
          <div>이름: {user.name}</div>
          <div>성별: {user.gender}</div>
          <div>생년월일: {user.birth.toLocaleString().slice(0, 11)}</div>
          <div>키: {user.height}cm</div>
        </>
      )}
      <ErrorMessage />
    </InfoBlock>
  );
};

export default Info;
