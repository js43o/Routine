import React, { PointerEvent, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { removeExercise } from 'modules/user';
import { ExerciseItem } from 'types';
import useDragExercise from 'hooks/useDragExercise';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import Button from 'components/common/Button';

const DayRoutineBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  position: relative;
`;

const ExerciseListBlock = styled.ul<{ isEditing: boolean }>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  gap: 0.25rem;
  width: 0;
  height: 4rem;
  padding: 0.5rem 2rem;
  border-radius: 0.5rem;
  background: ${({ isEditing, theme }) =>
    isEditing ? theme.primary : theme.background_sub};
  overflow: hidden;
  scroll-behavior: smooth;
  touch-action: ${({ isEditing }) => isEditing && 'none'};
  & > li {
    flex-shrink: 0;
    max-width: 6rem;
    overflow: hidden;
  }
`;

const ExerciseItemBlock = styled.button<{ isEditing?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 3.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  font-size: 0.875rem;
  line-height: 1rem;
  span {
  }
  &.hold {
    transform: scale(1.1);
  }
  @media (hover: hover) {
    &:hover {
      opacity: ${({ isEditing }) => (isEditing ? 0.75 : 1)};
    }
  }
  &:active {
    opacity: ${({ isEditing }) => (isEditing ? 0.5 : 1)};
  }
`;

const AddExerciseButton = styled(Button)<{ isEditing: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  border-radius: 50%;
  color: ${({ theme }) => theme.letter_primary};
  font-size: 2rem;
  visibility: ${({ isEditing }) => !isEditing && 'hidden'};
`;

const ScrollButton = styled(Button)<{ isEnd: boolean }>`
  position: absolute;
  z-index: 50;
  height: 100%;
  color: ${({ theme }) => theme.letter_primary};
  background: rgba(0, 0, 0, 0.2);
  font-size: 1.75rem;
`;

const PrevScrollButton = styled(ScrollButton)`
  left: 0;
`;

const NextScrollButton = styled(ScrollButton)`
  right: 0;
`;

type DayRoutineProps = {
  dayRoutine: ExerciseItem[];
  routineId: string;
  dayIdx: number;
  isVisible: boolean;
  isEditing: boolean;
  onOpenModal: (day: number) => void;
  onError: (error: string) => void;
};

const DayRoutine = ({
  dayRoutine,
  routineId,
  dayIdx,
  isVisible,
  isEditing,
  onOpenModal,
  onError,
}: DayRoutineProps) => {
  const dispatch = useDispatch();
  const { ref, moveTo, onDragStart } = useDragExercise();
  const tempDayRoutine = useRef<ExerciseItem[]>(dayRoutine);

  const onAddExercise = () => {
    if (!isEditing) return;
    if (dayRoutine.length >= 20) {
      onError('추가 가능한 최대 운동 종목 수는 20개입니다.');
      return;
    }
    onOpenModal(dayIdx);
  };

  const onPointerDownExercise = (e: PointerEvent, exerciseIdx: number) => {
    if (!e.target || !(e.target instanceof HTMLElement)) return;
    const elem = e.target.closest('li');
    if (!elem) return;

    const timer = setTimeout(() => {
      if (!isEditing) return;
      onDragStart(routineId, dayIdx, exerciseIdx, elem, e.clientX);
    }, 500);

    document.onpointerup = () => {
      clearTimeout(timer);
      document.onpointermove = null;
      document.onpointerup = null;

      onRemoveExercise(exerciseIdx);
    };
  };

  const onRemoveExercise = (exerciseIdx: number) => {
    if (!isEditing) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    dispatch(
      removeExercise({
        routineId,
        dayIdx,
        exerciseIdx,
      }),
    );
  };

  const onRemoveExerciseWithKey = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    exerciseIdx: number,
  ) => {
    if (e.key === 'Enter') onRemoveExercise(exerciseIdx);
  };

  useEffect(() => {
    if (dayRoutine.length <= 0) return;
    if (routineId && tempDayRoutine.current.length < dayRoutine.length)
      moveTo('end');
    tempDayRoutine.current = dayRoutine;
  }, [dayRoutine]);

  return (
    <DayRoutineBlock>
      <PrevScrollButton
        onPointerDown={() => moveTo('prev')}
        isEnd={ref.current?.scrollLeft === 0}
        tabIndex={!isVisible ? -1 : 0}
        aria-label="scroll prev"
      >
        <MdNavigateBefore />
      </PrevScrollButton>
      <ExerciseListBlock ref={ref} isEditing={isEditing}>
        {dayRoutine.map((exercise, idx) => (
          <li key={`${exercise.name}${idx}`}>
            <ExerciseItemBlock
              isEditing={isEditing}
              onPointerDown={(e) => onPointerDownExercise(e, idx)}
              onKeyUp={(e) => onRemoveExerciseWithKey(e, idx)}
            >
              <b>{exercise.name}</b>
              <small>
                {exercise.weight}kg, {exercise.numberOfTimes}x
                {exercise.numberOfSets}
              </small>
            </ExerciseItemBlock>
          </li>
        ))}
        <li>
          <AddExerciseButton
            onClick={dayIdx !== -1 && onAddExercise}
            isEditing={isEditing}
            aria-label="add exercise"
          >
            <BsPlusCircleDotted />
          </AddExerciseButton>
        </li>
      </ExerciseListBlock>
      <NextScrollButton
        onClick={() => moveTo('next')}
        isEnd={
          !!ref.current &&
          ref.current.scrollLeft ===
            ref.current.scrollWidth - ref.current.clientWidth
        }
        tabIndex={!isVisible ? -1 : 0}
        aria-label="scroll next"
      >
        <MdNavigateNext />
      </NextScrollButton>
    </DayRoutineBlock>
  );
};

export default React.memo(DayRoutine);
