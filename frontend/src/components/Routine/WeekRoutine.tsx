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
import DayRoutine from './DayRoutine';

const WeekRoutineBlock = styled.li<{ visible: boolean; editing?: boolean }>`
  display: flex;
  flex-direction: column;
  height: ${({ visible }) => (visible ? '35rem' : '48px')};
  padding: 6px;
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
      gap: 0.5rem;
      button {
        font-size: 1.5rem;
      }
    }
  }
`;

const TitleBlock = styled.div<{ editing: boolean }>`
  display: flex;
  place-items: center;
  gap: 0.5rem;
  flex-grow: 1;
  height: 34px;
  white-space: nowrap;
  font-size: 1.125rem;
  font-weight: bold;
  overflow: hidden;
  @media (hover: hover) {
    &:hover {
      opacity: 0.5;
    }
  }
  & > input {
    height: 2rem;
    min-width: 0;
  }
`;

const DaySpan = styled.b<{ dayIdx: number }>`
  margin: 0 0.25rem 0 0;
  color: ${({ dayIdx, theme }) => {
    if (dayIdx === 0) return theme.red;
    if (dayIdx === 6) return theme.blue;
    return 'letter_main';
  }};
`;

const OpenIndicator = styled(BsTriangleFill)<{ visible: number }>`
  flex-shrink: 0;
  transform: ${({ visible }) => (visible ? 'rotate(180deg)' : 'rotate(90deg)')};
  transition: transform 0.2s;
  font-size: 1rem;
`;

const RoutineContent = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  gap: 0.25rem;
`;

const DayRoutineWrapper = styled.li`
  display: flex;
  place-items: center;
  border-radius: 0.5rem;
  overflow: hidden;
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
  onSetVisible: (id: string | null) => void;
  onSetEditing: (id: string | null) => void;
};

const WeekRoutine = ({
  routine,
  isVisible,
  isEditing,
  onOpenModal,
  onSetVisible,
  onSetEditing,
}: WeekRoutineProps) => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const { message, onError } = useErrorMessage();

  const onSubmit = (routine: Routine) => {
    onSetEditing(null);
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
          onClick={() =>
            onSetVisible(!isEditing && isVisible ? null : routine.routineId)
          }
        >
          <OpenIndicator visible={isVisible ? 1 : 0} />
          {isEditing ? (
            <input
              title="루틴 이름"
              type="text"
              value={routine.title}
              maxLength={10}
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
              aria-label="unset current routine"
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
              aria-label="set current routine"
            >
              <BsStar />
            </SetCurrentRoutineButton>
          )}
          {isEditing ? (
            <CheckButton
              onClick={() => onSubmit(routine)}
              aria-label="save routine"
            >
              <BsCheckLg />
            </CheckButton>
          ) : (
            <EditButton
              onClick={() => onSetEditing(routine.routineId)}
              aria-label="edit routine"
            >
              <FaPencilAlt />
            </EditButton>
          )}
          <RemoveRoutineButton
            onClick={onRemoveRoutine}
            aria-label="remove routine"
          >
            <FaTrashAlt />
          </RemoveRoutineButton>
        </div>
      </div>
      <RoutineContent>
        {routine.weekRoutine.map((dayRoutine, dayIdx) => (
          <DayRoutineWrapper key={dayIdx}>
            <DaySpan dayIdx={dayIdx}>{dayidxToDaystr(dayIdx)}</DaySpan>
            <DayRoutine
              routineId={routine.routineId}
              dayIdx={dayIdx}
              dayRoutine={dayRoutine}
              editing={isEditing}
              onOpenModal={onOpenModal}
              onError={onError}
            />
          </DayRoutineWrapper>
        ))}
      </RoutineContent>
      <ErrorMessage message={message} />
    </WeekRoutineBlock>
  );
};

export default React.memo(WeekRoutine);
