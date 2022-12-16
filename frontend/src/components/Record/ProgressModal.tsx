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

const HeaderBlock = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.5rem;
`;

const ProgressListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  overflow-y: scroll;
`;

const ProgressItemHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.background_sub};
  text-align: center;
  white-space: nowrap;
  font-weight: bold;
  div + div {
    display: flex;
    flex-direction: column;
    border-left: 1px solid ${({ theme }) => theme.border_main};
  }
`;

const ProgressItemBlock = styled(ProgressItemHeader)`
  background: ${({ theme }) => theme.background_main};
  @media (hover: hover) {
    :hover {
      opacity: 0.75;
    }
  }
  :active {
    opacity: 0.5;
  }
  cursor: pointer;
`;

const FooterBlock = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  .error {
  }
`;

const ConfirmBlock = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  .weight,
  .muscleMass,
  .fatMass {
    display: flex;
    flex-direction: column;
    place-items: center;
    input {
      font-size: 1.5rem;
      width: 3.5rem;
      @media (min-width: 430px) {
        font-size: 2rem;
        width: 4rem;
      }
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    @media (min-width: 430px) {
      flex-direction: row;
      button {
        font-size: 1.25rem;
      }
    }
  }
`;

type AddProgressModalProps = {
  data: ProgressItem[];
  visible: boolean;
  onCloseModal: () => void;
};

const ProgressModal = ({
  data,
  visible,
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

  const onChange = (
    type: 'weight' | 'muscleMass' | 'fatMass',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.value.length > 3) return;
    if (e.target.value.length > 1 && e.target.value[0] === '0') {
      e.target.value = e.target.value.slice(1);
    }
    setInput({ ...input, [type]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.weight || !input.muscleMass || !input.fatMass) {
      onError('입력값을 확인해주세요.');
      return;
    }
    if (
      data[0].data.length > 0 &&
      data[0].data[data[0].data.length - 1].x === getDatestr(new Date())
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
    <Modal visible={visible}>
      <HeaderBlock>
        <h2>체성분 기록</h2>
      </HeaderBlock>
      <ProgressListBlock>
        <ProgressItemHeader>
          <div>날짜</div>
          <div>체중</div>
          <div>골격근량</div>
          <div>체지방량</div>
        </ProgressItemHeader>
        {[...Array(data[0].data.length)].map((_, i) => (
          <ProgressItemBlock onClick={() => onRemove(data[0].data[i].x)}>
            <div>
              <b>{data[0].data[i].x.slice(2).replaceAll('-', '.')}</b>
            </div>
            <div>{data[0].data[i].y}kg</div>
            <div>{data[1].data[i].y}kg</div>
            <div>{data[2].data[i].y}kg</div>
          </ProgressItemBlock>
        ))}
      </ProgressListBlock>
      <FooterBlock>
        <ConfirmBlock onSubmit={onSubmit}>
          <div className="weight">
            <b>체중</b>
            <input
              type="number"
              min={0}
              max={300}
              value={input.weight}
              onChange={(e) => onChange('weight', e)}
            />
            kg
          </div>
          <div className="muscleMass">
            <b>골격근량</b>
            <input
              type="number"
              min={0}
              max={150}
              value={input.muscleMass}
              onChange={(e) => onChange('muscleMass', e)}
            />
            kg
          </div>
          <div className="fatMass">
            <b>체지방량</b>
            <input
              type="number"
              min={0}
              max={150}
              value={input.fatMass}
              onChange={(e) => onChange('fatMass', e)}
            />
            kg
          </div>
          <SubmitButtons onClose={onClose} />
        </ConfirmBlock>
        <ErrorMessage message={message} />
      </FooterBlock>
    </Modal>
  );
};

export default ProgressModal;
