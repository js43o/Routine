import React from 'react';
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
import ErrorMessage from 'components/common/ErrorMessage';
import useErrorMessage from 'hooks/useErrorMessage';
import { dayidxToDaystr } from 'lib/methods';
import { BsTriangleFill, BsCheckLg, BsStar, BsStarFill } from 'react-icons/bs';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import RoutineExerciseList from './DayRoutine';

const WeekRoutineBlock = styled.li<{ visible: boolean; editing?: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${({ visible }) => (visible ? '35rem' : '48px')};
  padding: 0.5rem;
  border: 1px solid
    ${({ editing, theme }) => (editing ? theme.primary : theme.border_main)};
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border 0.2s, height 0.5s;
  .header {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 0.5rem;
    .buttons {
      display: flex;
      place-items: center;
      gap: 0.5rem;
      button {
        font-size: 1.5rem;
      }
    }
  }
`;

const TitleBlock = styled.div<{ editing: boolean }>`
  height: 34px;
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

const RemoveRoutineButton = styled(Button)`
  color: ${({ theme }) => theme.red};
`;

const SetCurrentRoutineButton = styled(Button)``;

const UnsetCurrentRoutineButton = styled(Button)`
  color: ${({ theme }) => theme.yellow};
`;

const EditButton = styled(Button)``;

const CheckButton = styled(Button)`
  color: ${({ theme }) => theme.primary};
`;

type WeekRoutineProps = {
  routine: Routine;
  isVisible: boolean;
  isEditing: boolean;
  onOpenModal: (day: number) => void;
  onSetVisible: (id?: string) => void;
  onSetEditing: (id?: string) => void;
};

const WeekRoutine = ({
  routine,
  isVisible = false,
  isEditing = false,
  onOpenModal,
  onSetVisible,
  onSetEditing,
}: WeekRoutineProps) => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const { message, onError } = useErrorMessage();

  const onSubmit = (routine: Routine) => {
    onSetEditing();
    dispatch(editRoutine({ username: user.username, routine }));
  };

  const onRemoveRoutine = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    if (user.currentRoutineId === routine.routineId)
      dispatch(setCurrentRoutine({ username: user.username, routineId: '' }));
    dispatch(
      removeRoutine({ username: user.username, routineId: routine.routineId }),
    );
  };

  return (
    <WeekRoutineBlock visible={isVisible} editing={isEditing}>
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
            <UnsetCurrentRoutineButton
              onClick={() =>
                dispatch(
                  setCurrentRoutine({
                    username: user.username,
                    routineId: '',
                  }),
                )
              }
            >
              <BsStarFill />
            </UnsetCurrentRoutineButton>
          ) : (
            <SetCurrentRoutineButton
              onClick={() =>
                dispatch(
                  setCurrentRoutine({
                    username: user.username,
                    routineId: routine.routineId,
                  }),
                )
              }
            >
              <BsStar />
            </SetCurrentRoutineButton>
          )}
          {isEditing ? (
            <CheckButton onClick={() => onSubmit(routine)}>
              <BsCheckLg />
            </CheckButton>
          ) : (
            <EditButton onClick={() => onSetEditing(routine.routineId)}>
              <FaPencilAlt />
            </EditButton>
          )}
          <RemoveRoutineButton onClick={onRemoveRoutine}>
            <FaTrashAlt />
          </RemoveRoutineButton>
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
                onError={onError}
              />
            </div>
          </RoutineDetailItem>
        ))}
      </RoutineDetailBlock>
      <ErrorMessage message={message} />
    </WeekRoutineBlock>
  );
};

export default React.memo(WeekRoutine);
