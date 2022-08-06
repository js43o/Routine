import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { User } from 'types';
import { FaPencilAlt } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs';
import Button from 'components/common/Button';
import { useDispatch } from 'react-redux';
import { setInfo, setProfileImage } from 'modules/user';
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

const ImageBlock = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 128px;
  height: 128px;
  background: ${({ theme }) => theme.background_sub};
  border-radius: 50%;
  cursor: pointer;
  .image_upload {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  input {
    display: none;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  overflow: hidden;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  .nick {
    display: flex;
    gap: 0.5rem;
    font-size: 2rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    #nick {
      font-size: 1.5rem;
      width: 12rem;
    }
  }
  @media (min-width: 430px) {
    text-align: left;
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

  const onSubmitInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^[ㄱ-ㅎ가-힇A-Za-z\d]{1,10}/.test(nickname)) {
      onError('닉네임은 1-10자의 한글/영문/숫자입니다.');
      return;
    }
    dispatch(setInfo({ username: user.username, nickname, intro }));
    resetError();
    setEdit(false);
  };

  const onSubmitImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    dispatch(setProfileImage({ username: user.username, image: formData }));
  };

  useEffect(() => {
    setNickname(user.nickname);
    setIntro(user.intro);
  }, [user]);

  return (
    <>
      <ProfileBlock>
        <ImageBlock htmlFor="profileImage">
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={(e) => onSubmitImage(e)}
          />
          {user.profileImage ? (
            <img src={user.profileImage} alt="profile_image" />
          ) : (
            <div className="image_upload">
              <b>사진 등록</b>
              <small>(3MB 이하)</small>
            </div>
          )}
        </ImageBlock>
        {edit ? (
          <InfoBlock>
            <form onSubmit={onSubmitInfo}>
              <div className="nick">
                <input
                  id="nick"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임"
                  maxLength={10}
                />
                <CheckButton type="submit">
                  <BsCheckLg />
                </CheckButton>
              </div>
              <input
                id="intro"
                type="text"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="한 줄 소개"
                maxLength={20}
              />
            </form>
          </InfoBlock>
        ) : (
          <InfoBlock>
            <div className="nick">
              <b>{user.nickname}</b>
              {!edit && (
                <EditButton onClick={() => setEdit(true)}>
                  <FaPencilAlt />
                </EditButton>
              )}
            </div>
            <span>{user.intro || '자기소개가 없습니다.'}</span>
          </InfoBlock>
        )}
      </ProfileBlock>
      <ErrorMessage />
    </>
  );
};

export default Profile;
