import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { addProgress, removeProgress } from 'modules/user';
import { ProgressItem } from 'types';
import { userSelector } from 'modules/hooks';
import { getDatestr } from 'lib/methods';
import useErrorMessage from 'hooks/useErrorMessage';
import SubmitButtons from 'components/common/SubmitButtons';
import ErrorMessage from 'components/common/ErrorMessage';
import Modal from 'components/common/Modal';
import InputConfirm from 'components/common/InputConfirm';
import Button from 'components/common/Button';

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border_main};
  .category {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    place-items: center;
    justify-content: space-evenly;
  }
  & > span {
    color: ${({ theme }) => theme.letter_sub};
  }
`;

const ProgressListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.25rem;
  padding: 0.25rem;
  background: ${({ theme }) => theme.background_sub};
  width: 100%;
  overflow-y: scroll;
`;

const ProgressItemBlock = styled(Button)`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  font-weight: inherit;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  .contents {
    display: flex;
    gap: 1rem;
    div {
      display: flex;
      flex-direction: column;
    }
  }
`;

const FooterBlock = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  border-top: 1px solid ${({ theme }) => theme.border_main};
`;

type AddProgressModalProps = {
  progress: ProgressItem[];
  isVisible: boolean;
  onCloseModal: () => void;
};

const ProgressModal = ({
  progress,
  isVisible,
  onCloseModal,
}: AddProgressModalProps) => {
  const [input, setInput] = useState({
    weight: 0,
    muscleMass: 0,
    fatMass: 0,
  });
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const { message, onError, resetError } = useErrorMessage();

  const onChangeInput = (
    type: 'weight' | 'muscleMass' | 'fatMass',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    if (value.length > 3) return;

    setInput({ ...input, [type]: +value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.weight || !input.muscleMass || !input.fatMass) {
      onError('입력값을 확인해주세요.');
      return;
    }

    if (
      progress[0].data.length > 0 &&
      progress[0].data.slice(-1)[0].x === getDatestr(new Date())
    ) {
      onError('이미 오늘 기록을 추가했습니다.');
      return;
    }

    dispatch(
      addProgress({
        username: user.username,
        progress: {
          date: getDatestr(new Date()),
          weight: +input.weight,
          muscleMass: +input.muscleMass,
          fatMass: +input.fatMass,
        },
      }),
    );

    setInput({
      weight: 0,
      muscleMass: 0,
      fatMass: 0,
    });
    resetError();
  };

  const onClose = () => {
    onCloseModal();
    resetError();
  };

  const onRemove = (date: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    dispatch(removeProgress({ username: user.username, date }));
    resetError();
  };

  return (
    <Modal isVisible={isVisible}>
      <HeaderBlock>
        <h2>체성분 기록</h2>
      </HeaderBlock>
      <ProgressListBlock>
        {[...Array(progress[0].data.length)].map((_, idx) => (
          <li key={idx}>
            <ProgressItemBlock
              onClick={() => onRemove(progress[0].data[idx].x)}
            >
              <div className="date">
                <h6>{progress[0].data[idx].x.slice(2).replaceAll('-', '.')}</h6>
              </div>
              <div className="contents">
                <div>
                  <small>체중</small>
                  {progress[0].data[idx].y} kg
                </div>
                <div>
                  <small>골격근량</small>
                  {progress[1].data[idx].y} kg
                </div>
                <div>
                  <small>체지방량</small>
                  {progress[2].data[idx].y} kg
                </div>
              </div>
            </ProgressItemBlock>
          </li>
        ))}
      </ProgressListBlock>
      <FooterBlock>
        <InputConfirm onSubmit={onSubmit}>
          <div className="weight">
            <label htmlFor="weight">체중</label>
            <input
              id="weight"
              className="count"
              type="number"
              min={0}
              max={300}
              value={input.weight.toString()}
              onChange={(e) => onChangeInput('weight', e)}
            />
            kg
          </div>
          <div className="muscleMass">
            <label htmlFor="muscleMass">골격근량</label>
            <input
              id="muscleMass"
              className="count"
              type="number"
              min={0}
              max={150}
              value={input.muscleMass.toString()}
              onChange={(e) => onChangeInput('muscleMass', e)}
            />
            kg
          </div>
          <div className="fatMass">
            <label htmlFor="fatMass">체지방량</label>
            <input
              id="fatMass"
              className="count"
              type="number"
              min={0}
              max={150}
              value={input.fatMass.toString()}
              onChange={(e) => onChangeInput('fatMass', e)}
            />
            kg
          </div>
          <SubmitButtons onClose={onClose} aria-label="add progress" />
        </InputConfirm>
        <ErrorMessage message={message} />
      </FooterBlock>
    </Modal>
  );
};

export default ProgressModal;
