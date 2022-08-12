import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { initialPerform, toggleCheck, checkAll } from 'modules/perform';
import { addComplete } from 'modules/user';
import { userSelector, performSelector } from 'modules/hooks';
import { getDatestr } from 'lib/methods';
import useErrorMessage from 'hooks/useErrorMessage';
import {
  MdRadioButtonUnchecked,
  MdOutlineCheckCircleOutline,
} from 'react-icons/md';
import { BsStar } from 'react-icons/bs';

const PerformRoutineBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
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
  color: ${({ completed, theme }) => completed && theme.letter_primary};
`;

const SetButton = styled.div<{ available: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  place-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 2rem;
  opacity: ${({ available }) => !available && 0.25};
  cursor: ${({ available }) => available && 'pointer'};
  transition: opacity 0.2s;
  b {
    font-size: 0.75rem;
  }
`;

const CompleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_sub};
  font-size: 1.5rem;
  font-weight: bold;
  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.secondary};
    }
  }
  &:active {
    color: ${({ theme }) => theme.letter_primary};
    background: ${({ theme }) => theme.primary};
  }
  cursor: pointer;
`;

const MemoBlock = styled.textarea<{ visible: number }>`
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  max-height: ${({ visible }) => (visible ? '10rem' : '0')};
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.memo_body};
`;

type PerformRoutineProps = {
  currentRoutineId: string;
  complete: boolean;
};

const PerformRoutine = ({
  currentRoutineId,
  complete,
}: PerformRoutineProps) => {
  const { user } = useSelector(userSelector);
  const performs = useSelector(performSelector);
  const dispatch = useDispatch();
  const { onError, ErrorMessage } = useErrorMessage();
  const [memo, setMemo] = useState('');

  const currentRoutine = user.routines.find(
    (item) => item.routineId === currentRoutineId,
  );

  useEffect(() => {
    if (currentRoutine && currentRoutine.lastModified !== performs.lastModified)
      dispatch(
        initialPerform({
          lastModified: currentRoutine.lastModified,
          exerciseList: todayRoutine,
        }),
      );
  }, []);

  if (!currentRoutine)
    return (
      <PerformRoutineBlock>
        <div className="empty">
          <p>
            사용 중인 루틴이 없습니다.
            <br />
            <b>루틴</b> 페이지에서 운동 루틴을 추가한 후<br />
            <BsStar />를 눌러 사용할 루틴을 지정해주세요.
          </p>
        </div>
      </PerformRoutineBlock>
    );

  const day = new Date().getDay();
  const todayRoutine = currentRoutine.weekRoutine[day];

  if (!todayRoutine.length) {
    return <PerformRoutineBlock>오늘은 쉬는 날!</PerformRoutineBlock>;
  }

  if (complete)
    return <PerformRoutineBlock>오늘 운동을 완료했습니다.</PerformRoutineBlock>;

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
      onError('남은 운동이 있습니다.');
      return;
    }
    dispatch(
      addComplete({
        username: user.username,
        complete: {
          date: getDatestr(new Date()),
          list: todayRoutine,
          memo,
        },
      }),
    );
    setMemo('');
  };

  return (
    <PerformRoutineBlock>
      {performs.list.map((p, i) => (
        <PerformExerciseBlock>
          <ExerciseBlock
            completed={!p.setCheck.filter((a) => !a).length}
            onClick={() => onCheckAll(i)}
          >
            <b>{p.exercise.exercise}</b>
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
      <ErrorMessage />
    </PerformRoutineBlock>
  );
};

export default PerformRoutine;
