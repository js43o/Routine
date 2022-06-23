import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { addProgress, ProgressItem, removeProgress } from 'modules/user';
import { getDatestr } from 'lib/methods';
import Button from 'components/common/Button';
import ErrorMessage from 'lib/ErrorMessage';

const SetProgressWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  place-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.5s;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;

const SetProgressBlock = styled.div<{ visible: boolean; offset: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  top: ${({ visible }) => (visible ? '5%' : '100%')};
  left: 5%;
  position: fixed;
  max-width: 480px;
  width: 90%;
  max-height: 90%;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.background_main};
  overflow: hidden;
  transition: top 0.5s;
  @media (min-width: 540px) {
    left: ${({ offset }) => offset / 2 - 240}px;
  }
  h2 {
    align-self: center;
  }
`;

const ProgressListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
`;

const ProgressItemBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.25rem;
  text-align: center;
  div {
    display: flex;
    flex-direction: column;
  }
  &:first-of-type {
    background: ${({ theme }) => theme.background_sub};
    font-weight: bold;
  }
  &.button {
    @media (hover: hover) {
      :hover {
        opacity: 0.75;
      }
    }
    :active {
      opacity: 0.5;
    }
    cursor: pointer;
  }
`;

const FooterBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const ConfirmBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  div {
    display: grid;
    place-items: center;
    input {
      font-size: 2rem;
      width: 5rem;
    }
  }
`;

const ButtonsBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  .submit {
    padding: 0.25rem 1rem;
    background: ${({ theme }) => theme.primary};
    font-size: 1.25rem;
  }
  .close {
    padding: 0.25rem 1rem;
    background: ${({ theme }) => theme.background_sub};
    font-size: 1.25rem;
  }
`;

type AddProgressModalProps = {
  data: ProgressItem[];
  visible: boolean;
  offset: number;
  onCloseModal: () => void;
};

const SetProgressModal = ({
  data,
  visible,
  offset,
  onCloseModal,
}: AddProgressModalProps) => {
  const [input, setInput] = useState({
    weight: 0,
    muscleMass: 0,
    fatMass: 0,
  });
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');

  const onChange = (
    type: 'weight' | 'muscleMass' | 'fatMass',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.value.length > 3) return;
    setInput({ ...input, [type]: e.target.value });
  };

  const onSubmit = () => {
    if (!input.weight || !input.muscleMass || !input.fatMass) {
      setMessage('입력값을 확인해주세요.');
      return;
    }
    if (
      data[0].data.length > 0 &&
      data[0].data[data[0].data.length - 1].x === getDatestr(new Date())
    ) {
      setMessage('이미 오늘 기록을 추가했습니다.');
      return;
    }

    dispatch(
      addProgress({
        date: getDatestr(new Date()),
        weight: input.weight,
        muscleMass: input.muscleMass,
        fatMass: input.fatMass,
      }),
    );
    setInput({
      weight: 0,
      muscleMass: 0,
      fatMass: 0,
    });
    setMessage('');
  };

  const onClose = () => {
    onCloseModal();
    setMessage('');
  };

  const onRemove = (date: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    dispatch(removeProgress(date));
    setMessage('');
  };

  return (
    <SetProgressWrapper visible={visible}>
      <SetProgressBlock visible={visible} offset={offset}>
        <ProgressListBlock>
          <ProgressItemBlock>
            <div>날짜</div>
            <div>체중</div>
            <div>골격근량</div>
            <div>체지방량</div>
          </ProgressItemBlock>
          {[...Array(data[0].data.length)].map((_, i) => (
            <ProgressItemBlock
              className="button"
              onClick={() => onRemove(data[0].data[i].x)}
            >
              <b>{data[0].data[i].x}</b>
              <div>{data[0].data[i].y}kg</div>
              <div>{data[1].data[i].y}kg</div>
              <div>{data[2].data[i].y}kg</div>
            </ProgressItemBlock>
          ))}
        </ProgressListBlock>
        <h2>새로운 기록 추가</h2>
        <FooterBlock>
          <ConfirmBlock>
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
              <b>지방량</b>
              <input
                type="number"
                min={0}
                max={150}
                value={input.fatMass}
                onChange={(e) => onChange('fatMass', e)}
              />
              kg
            </div>
          </ConfirmBlock>
          <ButtonsBlock>
            <Button className="submit" onClick={onSubmit}>
              추가
            </Button>
            <Button className="close" onClick={onClose}>
              취소
            </Button>
          </ButtonsBlock>
        </FooterBlock>
        <ErrorMessage message={message} />
      </SetProgressBlock>
    </SetProgressWrapper>
  );
};

export default SetProgressModal;
