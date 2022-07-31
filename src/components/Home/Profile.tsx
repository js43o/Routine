import React, { useState } from 'react';
import styled from '@emotion/styled';
import { User } from 'types';
import { FaPencilAlt } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs';
import Button from 'components/common/Button';
import { useDispatch } from 'react-redux';
import { setInfo } from 'modules/user';
import useErrorMessage from 'hooks/useErrorMessage';

const ProfileBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  align-items: center;
  button {
    font-size: 1.5rem;
  }
  @media (min-width: 430px) {
    flex-direction: row;
  }
`;

const ImageBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 128px;
  height: 128px;
  background: ${({ theme }) => theme.background_sub};
  border-radius: 50%;
  cursor: pointer;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  span {
    font-size: 1.25rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    input {
      font-size: 1.25rem;
      width: 12rem;
    }
  }
`;

const EditButton = styled(Button)``;

const CheckButton = styled(Button)`
  color: ${({ theme }) => theme.primary};
`;

type ProfileProps = {
  user: User;
};

const Profile = ({ user }: ProfileProps) => {
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState(user.nickname);
  const [intro, setIntro] = useState(user.intro);
  const [edit, setEdit] = useState(false);
  const { onError, resetError, ErrorMessage } = useErrorMessage();

  const onSubmit = () => {
    if (!/^[ㄱ-ㅎ가-힇A-Za-z\d]{1,10}/.test(nickname)) {
      onError('닉네임은 1-10자의 한글/영문/숫자입니다.');
      return;
    }
    dispatch(setInfo({ username: user.username, nickname, intro }));
    resetError();
    setEdit(false);
  };

  return (
    <>
      <ProfileBlock>
        <ImageBlock>
          {user.profileImage ? (
            <img src={user.profileImage} alt="profile_image" />
          ) : (
            <b>사진 등록</b>
          )}
        </ImageBlock>
        {edit ? (
          <InfoBlock>
            <form>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                maxLength={10}
              />
              <input
                type="text"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="한 줄 소개"
                maxLength={30}
              />
            </form>
          </InfoBlock>
        ) : (
          <InfoBlock>
            <b>{user.nickname}</b>
            <span>{user.intro || '자기소개가 없습니다.'}</span>
          </InfoBlock>
        )}
        {edit ? (
          <CheckButton onClick={onSubmit}>
            <BsCheckLg />
          </CheckButton>
        ) : (
          <EditButton onClick={() => setEdit(true)}>
            <FaPencilAlt />
          </EditButton>
        )}
      </ProfileBlock>
      <ErrorMessage />
    </>
  );
};

export default Profile;
