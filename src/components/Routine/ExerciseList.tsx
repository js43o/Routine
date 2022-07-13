import React, { PointerEvent, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { removeExercise } from 'modules/user';
import { ExerciseItem } from 'types';
import useScroll from 'hooks/useExerciseList';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import Button from 'components/common/Button';

const ExerciseListWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const ExerciseListBlock = styled.ul<{ editing: boolean }>`
  display: flex;
  flex-grow: 1;
  align-items: center;
  gap: 0.25rem;
  width: 0;
  height: 4rem;
  padding: 0.5rem 2rem;
  border-radius: 0.5rem;
  background: ${({ editing, theme }) =>
    editing ? theme.primary : theme.background_sub};
  overflow: hidden;
  scroll-behavior: smooth;
  touch-action: ${({ editing }) => editing && 'none'};
`;

const ExerciseItemBlock = styled.li<{ editing?: number }>`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 3.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  transition: opacity 0.2s;
  span {
    font-size: 0.8rem;
  }
  @media (hover: hover) {
    &:hover {
      opacity: ${({ editing }) => (editing ? 0.75 : 1)};
    }
  }
  &:active {
    opacity: ${({ editing }) => (editing ? 0.5 : 1)};
  }
  &.hold {
    transform: scale(1.1);
  }
`;

const AddExerciseButton = styled(BsPlusCircleDotted)<{ editing: number }>`
  display: flex;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  color: ${({ theme }) => theme.letter_primary};
  font-size: 2rem;
  visibility: ${({ editing }) => (editing ? '' : 'hidden')};
`;

const PrevScrollButton = styled(Button)<{ isEnd: boolean }>`
  position: absolute;
  z-index: 50;
  left: 0;
  height: 100%;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  font-size: 1.75rem;
`;

const NextScrollButton = styled(Button)<{ isEnd: boolean }>`
  z-index: 50;
  position: absolute;
  right: 0;
  height: 100%;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  font-size: 1.75rem;
`;

type ExerciseListProps = {
  dayRoutine: ExerciseItem[];
  routineId: string;
  dayIdx: number;
  editing: boolean;
  onOpenModal: (day: number) => void;
};

const ExerciseList = ({
  dayRoutine,
  routineId = '',
  dayIdx = -1,
  editing = false,
  onOpenModal,
}: ExerciseListProps) => {
  const dispatch = useDispatch();
  const { ref, moveTo, onDragStart } = useScroll();
  const dr = useRef<ExerciseItem[]>(dayRoutine);

  const onPointerDown = (e: PointerEvent, idx: number) => {
    const elem = (e.target as HTMLElement).closest('li') as HTMLLIElement;
    const timer = setTimeout(() => {
      if (!editing) {
        return;
      }
      onDragStart(routineId, dayIdx, idx, elem, e.clientX);
    }, 500);
    document.onpointerup = () => {
      clearTimeout(timer);
      document.onpointermove = null;
      document.onpointerup = null;
      if (editing)
        dispatch(
          removeExercise({
            routineId,
            day: dayIdx,
            idx,
          }),
        );
    };
  };

  useEffect(() => {
    if (dayRoutine.length <= 0) return;
    if (routineId && dr.current.length < dayRoutine.length) moveTo('end');
    dr.current = dayRoutine;
  }, [dayRoutine]);

  return (
    <ExerciseListWrapper>
      <PrevScrollButton
        onPointerDown={() => moveTo('prev')}
        isEnd={ref.current?.scrollLeft === 0}
      >
        <MdNavigateBefore />
      </PrevScrollButton>
      <ExerciseListBlock ref={ref} editing={editing}>
        {dayRoutine.map((s, i) => (
          <ExerciseItemBlock
            editing={editing ? 1 : 0}
            onPointerDown={(e) => onPointerDown(e, i)}
          >
            <b>{s.exercise}</b>
            <small>
              {s.weight}kg, {s.numberOfTimes}x{s.numberOfSets}
            </small>
          </ExerciseItemBlock>
        ))}
        {onOpenModal && (
          <Button
            onClick={
              dayIdx !== -1 && editing ? () => onOpenModal(dayIdx) : null
            }
          >
            <AddExerciseButton editing={editing ? 1 : 0} />
          </Button>
        )}
      </ExerciseListBlock>
      <NextScrollButton
        onClick={() => moveTo('next')}
        isEnd={
          ref.current
            ? ref.current.scrollLeft ===
              ref.current.scrollWidth - ref.current.clientWidth
            : false
        }
      >
        <MdNavigateNext />
      </NextScrollButton>
    </ExerciseListWrapper>
  );
};

export default React.memo(ExerciseList);
