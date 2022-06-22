import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { performSelector } from 'modules/hooks';
import { Routine } from 'modules/routine';
import {
  MdRadioButtonUnchecked,
  MdOutlineCheckCircleOutline,
} from 'react-icons/md';
import { initialPerform, toggleCheck, checkAll } from 'modules/perform';
import { addCompleteDay } from 'modules/user';
import { getDatestr } from 'lib/methods';
import AlertModal from 'components/common/AlertModal';

const PerformRoutineBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.background_main};
  border-radius: 0.5rem;
`;

const PerformExerciseBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.background_sub};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ExerciseBlock = styled.div<{ completed: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  border-radius: 0 0 0.5rem 0;
  padding: 0.5rem;
  background: ${({ completed, theme }) =>
    completed ? theme.primary : theme.background_sub};
`;

const SetButton = styled.div<{ available: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  place-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 2rem;
  opacity: ${({ available }) => (available ? 1 : 0.25)};
  transition: opacity 0.2s;
  cursor: pointer;
  b {
    font-size: 0.75rem;
  }
`;

const CompleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_sub};
  font-size: 1.5rem;
  font-weight: bold;
  @media (hover: hover) {
    &:hover {
      opacity: 0.75;
    }
  }
  &:active {
    background: ${({ theme }) => theme.primary};
  }
  cursor: pointer;
`;

const MemoBlock = styled.textarea<{ visible: number }>`
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  max-height: ${({ visible }) => (visible ? '10rem' : '0')};
  padding: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.memo_body};
`;

type PerformRoutineProps = {
  currentRoutine: Routine | null;
  complete: boolean;
};

const PerformRoutine = ({ currentRoutine, complete }: PerformRoutineProps) => {
  const performs = useSelector(performSelector);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (currentRoutine && currentRoutine.lastModified !== performs.lastModified)
      dispatch(
        initialPerform({
          lastModified: currentRoutine.lastModified,
          exerciseList: todayRoutine,
        }),
      );
  }, []);

  if (!currentRoutine) return <h4>사용 중인 루틴이 없습니다.</h4>;

  const day = new Date().getDay();
  const todayRoutine = currentRoutine.weekRoutine[day];

  if (!todayRoutine.length) {
    return (
      <h4>
        <i># 오늘은 쉬는 날!</i>
      </h4>
    );
  }

  if (complete)
    return (
      <h4>
        <b>오늘 운동을 완료했습니다.</b>
      </h4>
    );

  const onToggleCheck = (exerIdx: number, setIdx: number) =>
    dispatch(toggleCheck({ exerIdx, setIdx }));
  const onCheckAll = (exerIdx: number) => dispatch(checkAll({ exerIdx }));
  const isCompleted = () =>
    performs.list.reduce(
      (acc, exer) => acc + exer.setCheck.filter((a) => !a).length,
      0,
    ) === 0;
  const onMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMemo(e.target.value);
  const onComplete = () => {
    if (!isCompleted()) {
      setModal(true);
      setTimeout(() => setModal(false), 2000);
    } else {
      dispatch(
        addCompleteDay({
          date: getDatestr(new Date()),
          list: todayRoutine,
          memo,
        }),
      );
      setMemo('');
    }
  };

  return (
    <>
      <AlertModal visible={modal} text="남은 운동이 있습니다." />
      <PerformRoutineBlock>
        {performs.list.map((p, i) => (
          <PerformExerciseBlock>
            <ExerciseBlock
              completed={!p.setCheck.filter((a) => !a).length}
              onClick={() => onCheckAll(i)}
            >
              <b>{p.exercise.exercise.name}</b>
              <span>
                {p.exercise.weight}kg, {p.exercise.numberOfTimes}회
              </span>
            </ExerciseBlock>
            {p.setCheck.map((_, j) => (
              <SetButton
                available={j === 0 || p.setCheck[j - 1]}
                onClick={() => onToggleCheck(i, j)}
              >
                {p.setCheck[j] ? (
                  <MdOutlineCheckCircleOutline />
                ) : (
                  <MdRadioButtonUnchecked />
                )}
                <b>{j + 1}세트</b>
              </SetButton>
            ))}
          </PerformExerciseBlock>
        ))}
        <MemoBlock
          placeholder="오늘의 운동 소감은?"
          visible={isCompleted() ? 1 : 0}
          rows={5}
          wrap="soft"
          onChange={onMemo}
          value={memo}
        ></MemoBlock>
        <CompleteButton onClick={onComplete}>운동완료</CompleteButton>
      </PerformRoutineBlock>
    </>
  );
};

export default PerformRoutine;
