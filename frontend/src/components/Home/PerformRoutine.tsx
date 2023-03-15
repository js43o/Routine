import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { initialPerform, toggleCheck, checkAll } from 'modules/perform';
import { addComplete } from 'modules/user';
import { userSelector, performSelector } from 'modules/hooks';
import { getDatestr } from 'lib/methods';
import useErrorMessage from 'hooks/useErrorMessage';
import ErrorMessage from 'components/common/ErrorMessage';
import {
  MdRadioButtonUnchecked,
  MdOutlineCheckCircleOutline,
} from 'react-icons/md';
import { BsStar } from 'react-icons/bs';
import Button from 'components/common/Button';

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
  align-items: stretch;
  border: 1px solid ${({ theme }) => theme.background_sub};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ExerciseTitle = styled.div<{ completed: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  background: ${({ completed, theme }) =>
    completed ? theme.primary : theme.background_sub};
  color: ${({ completed, theme }) => completed && theme.letter_primary};
  text-align: center;
`;

const SetListBlock = styled.ul`
  display: flex;
  flex-wrap: wrap;
`;

const SetButton = styled.button<{ available: boolean }>`
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

const CompleteButton = styled(Button)<{ disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_sub};
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme, disabled }) =>
    disabled ? theme.letter_sub : theme.letter_primary};
  background: ${({ theme, disabled }) =>
    disabled ? theme.bacground_sub : theme.primary};
  cursor: ${({ disabled }) => (disabled ? 'unset' : 'pointer')};
  transition: background 0.2s;
`;

const MemoBlock = styled.textarea<{ visible: number }>`
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  max-height: ${({ visible }) => (visible ? '10rem' : '0')};
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.memo_body};
  transition: height 0.2s;
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
  const { message, onError } = useErrorMessage();
  const [memo, setMemo] = useState('');

  const currentRoutine = user.routines.find(
    (item) => item.routineId === currentRoutineId,
  );

  useEffect(() => {
    if (currentRoutine && currentRoutine.lastModified !== performs.lastModified)
      dispatch(
        initialPerform({
          lastModified: currentRoutine.lastModified,
          exerciseList,
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
  const exerciseList = currentRoutine.weekRoutine[day];

  if (!exerciseList.length) {
    return (
      <PerformRoutineBlock>
        <i>오늘은 쉬는 날!</i>
      </PerformRoutineBlock>
    );
  }

  if (complete)
    return <PerformRoutineBlock>오늘 운동을 완료했습니다.</PerformRoutineBlock>;

  const onToggleCheck = (exerciseIdx: number, setIdx: number) =>
    dispatch(toggleCheck({ exerciseIdx, setIdx }));

  const onCheckAll = (exerciseIdx: number) =>
    dispatch(checkAll({ exerciseIdx }));

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
          routineName: currentRoutine.title,
          exerciseList,
          memo,
        },
      }),
    );
    setMemo('');
  };

  return (
    <PerformRoutineBlock>
      {performs.list.map((perform, i) => (
        <PerformExerciseBlock key={i}>
          <ExerciseTitle
            completed={!perform.setCheck.filter((a) => !a).length}
            onClick={() => onCheckAll(i)}
          >
            <b>{perform.exercise.name}</b>
            <span>
              {perform.exercise.weight}kg x {perform.exercise.numberOfTimes}회
            </span>
          </ExerciseTitle>
          <SetListBlock>
            {perform.setCheck.map((_, j) => (
              <li key={j}>
                <SetButton
                  key={j}
                  available={j === 0 || perform.setCheck[j - 1]}
                  onClick={() => onToggleCheck(i, j)}
                >
                  {perform.setCheck[j] ? (
                    <MdOutlineCheckCircleOutline />
                  ) : (
                    <MdRadioButtonUnchecked />
                  )}
                  <b>{j + 1}세트</b>
                </SetButton>
              </li>
            ))}
          </SetListBlock>
        </PerformExerciseBlock>
      ))}
      <MemoBlock
        placeholder="오늘의 운동 소감은?"
        visible={isCompleted() ? 1 : 0}
        rows={4}
        maxLength={100}
        wrap="soft"
        onChange={onMemo}
        value={memo}
      ></MemoBlock>
      <CompleteButton onClick={onComplete} disabled={!isCompleted()}>
        운동완료
      </CompleteButton>
      <ErrorMessage message={message} />
    </PerformRoutineBlock>
  );
};

export default PerformRoutine;
