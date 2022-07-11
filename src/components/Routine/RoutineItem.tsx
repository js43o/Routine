import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import {
  setCurrentRoutine,
  changeRoutineTitle,
  removeRoutine,
  editRoutine,
} from 'modules/user';
import { userSelector } from 'modules/hooks';
import { Routine } from 'types';
import Button from 'components/common/Button';
import { dayidxToDaystr } from 'lib/methods';
import { BsTriangleFill, BsStar, BsStarFill } from 'react-icons/bs';
import { MdCheck } from 'react-icons/md';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import RoutineExerciseList from './ExerciseList';

const RoutineItemBlock = styled.li<{ visible: boolean; editing?: boolean }>`
  height: ${({ visible }) => (visible ? '42rem' : '3rem')};
  padding: 0.5rem;
  border: 1px solid
    ${({ editing, theme }) => (editing ? theme.primary : theme.border_main)};
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border 0.2s, height 0.5s;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    .buttons {
      display: flex;
      place-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
    }
  }
`;

const TitleBlock = styled.div<{ editing: boolean }>`
  height: 2rem;
  display: flex;
  place-items: center;
  gap: 0.5rem;
  flex-grow: 1;
  font-weight: bold;
  font-size: 1.25rem;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 0.25rem;
  @media (hover: hover) {
    &:hover {
      color: ${({ editing, theme }) => !editing && theme.letter_sub};
    }
  }
  input {
    min-width: 0;
    font-size: 1.025rem;
    margin-right: 0.5rem;
  }
`;

const DaySpan = styled.div<{ dayIdx: number }>`
  margin: 0 0.25rem 0 0;
  font-weight: bold;
  color: ${({ dayIdx, theme }) => {
    if (dayIdx === 0) return theme.red;
    if (dayIdx === 6) return theme.blue;
    return 'letter_main';
  }};
`;

const DetailButton = styled(BsTriangleFill)<{ visible: number }>`
  flex-shrink: 0;
  transform: ${({ visible }) => (visible ? 'rotate(180deg)' : 'rotate(90deg)')};
  transition: transform 0.2s;
`;

const RoutineDetailBlock = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  gap: 0.25rem;
`;

const RoutineDetailItem = styled.li`
  display: flex;
  place-items: center;
  border-radius: 0.5rem;
  overflow: hidden;
  .list {
    flex-grow: 1;
  }
`;

const RemoveRoutineButton = styled(FaTrashAlt)`
  color: ${({ theme }) => theme.red};
`;

const SetCurrentRoutineButton = styled(BsStar)``;

const UnsetCurrentRoutineButton = styled(BsStarFill)`
  color: ${({ theme }) => theme.yellow};
`;

const CheckButton = styled(MdCheck)`
  margin: -0.25rem;
  color: ${({ theme }) => theme.primary};
  font-size: 2rem;
`;

type RoutineItemProps = {
  routine: Routine;
  isVisible: boolean;
  isEditing: boolean;
  onOpenModal: (day: number) => void;
  onSetVisible: (id?: string) => void;
  onSetEditing: (id?: string) => void;
};

const RoutineItem = ({
  routine,
  isVisible = false,
  isEditing = false,
  onOpenModal,
  onSetVisible,
  onSetEditing,
}: RoutineItemProps) => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();

  const onSubmit = (routine: Routine) => {
    onSetEditing();
    dispatch(editRoutine({ username: user.username, routine }));
  };

  const onRemoveRoutine = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    if (user.currentRoutineId === routine.routineId)
      dispatch(setCurrentRoutine({ username: user.username, routineId: '' }));
    dispatch(
      removeRoutine({ username: user.username, routineId: routine.routineId }),
    );
  };

  useEffect(() => {
    if (user.currentRoutineId === routine.routineId)
      dispatch(
        setCurrentRoutine({
          username: user.username,
          routineId: routine.routineId,
        }),
      );
  }, [routine.lastModified]);

  return (
    <RoutineItemBlock
      key={routine.routineId}
      visible={isVisible}
      editing={isEditing}
    >
      <div className="header">
        <TitleBlock
          editing={isEditing}
          onClick={
            !isEditing && isVisible
              ? () => onSetVisible()
              : () => onSetVisible(routine.routineId)
          }
        >
          <DetailButton visible={isVisible ? 1 : 0} />
          {isEditing ? (
            <input
              type="text"
              value={routine.title}
              maxLength={12}
              onChange={(e) =>
                dispatch(
                  changeRoutineTitle({
                    routineId: routine.routineId,
                    value: e.target.value,
                  }),
                )
              }
            />
          ) : (
            routine.title
          )}
        </TitleBlock>
        <div className="buttons">
          {user.currentRoutineId === routine.routineId ? (
            <Button>
              <UnsetCurrentRoutineButton
                onClick={() =>
                  dispatch(
                    setCurrentRoutine({
                      username: user.username,
                      routineId: '',
                    }),
                  )
                }
              />
            </Button>
          ) : (
            <Button>
              <SetCurrentRoutineButton
                onClick={() =>
                  dispatch(
                    setCurrentRoutine({
                      username: user.username,
                      routineId: routine.routineId,
                    }),
                  )
                }
              />
            </Button>
          )}
          <Button>
            {isEditing ? (
              <CheckButton onClick={() => onSubmit(routine)} />
            ) : (
              <FaPencilAlt onClick={() => onSetEditing(routine.routineId)} />
            )}
          </Button>
          <Button>
            <RemoveRoutineButton onClick={onRemoveRoutine} />
          </Button>
        </div>
      </div>
      <RoutineDetailBlock>
        {routine.weekRoutine.map((dayRoutine, dayIdx) => (
          <RoutineDetailItem>
            <DaySpan dayIdx={dayIdx}>{dayidxToDaystr(dayIdx)}</DaySpan>
            <div className="list">
              <RoutineExerciseList
                dayRoutine={dayRoutine}
                dayIdx={dayIdx}
                routineId={routine.routineId}
                editing={isEditing}
                onOpenModal={onOpenModal}
              />
            </div>
          </RoutineDetailItem>
        ))}
      </RoutineDetailBlock>
    </RoutineItemBlock>
  );
};

export default React.memo(RoutineItem);
