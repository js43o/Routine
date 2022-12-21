import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Template from 'templates/Template';
import { addRoutine } from 'modules/user';
import { userSelector } from 'modules/hooks';
import { hideScroll, unhideScroll } from 'lib/methods';
import RoutineItem from 'components/Routine/WeekRoutine';
import AddExerciseModal from 'components/Routine/AddExerciseModal';
import Button from 'components/common/Button';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import useErrorMessage from 'hooks/useErrorMessage';
import ErrorMessage from 'components/common/ErrorMessage';

const AddRoutineButton = styled(Button)`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  width: 100%;
  place-items: center;
  padding: 0.5rem;
  margin-top: 1rem;
  font-size: 2rem;
  b {
    font-size: 1rem;
  }
`;

const RoutineListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 0.5rem;
`;

const RoutinePage = () => {
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const { message, onError } = useErrorMessage();

  const [modal, setModal] = useState(false);
  const [visible, setVisible] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [day, setDay] = useState<number | null>(null);

  const onOpenModal = useCallback((day: number) => {
    setDay(day);
    setModal(true);
    hideScroll();
  }, []);

  const onCloseModal = useCallback(() => {
    setModal(false);
    setTimeout(unhideScroll, 500);
  }, []);

  const onSetVisible = useCallback((routineId: string | null) => {
    if (routineId) {
      setVisible(routineId);
      return;
    }
    setVisible(null);
  }, []);

  const onSetEditing = useCallback((routineId: string | null) => {
    if (routineId) {
      setVisible(routineId);
      setEditing(routineId);
      return;
    }
    setEditing(null);
  }, []);

  const onAddRoutine = () => {
    if (user.routines.length >= 10) {
      onError('추가 가능한 루틴 수는 최대 10개입니다.');
      return;
    }
    const routineId = uuidv4();
    dispatch(addRoutine({ username: user.username, routineId }));
    onSetEditing(routineId);
  };

  return (
    <Template>
      <AddExerciseModal
        routineId={editing}
        day={day}
        visible={modal}
        onCloseModal={onCloseModal}
      />
      <h1>루틴 목록</h1>
      <RoutineListBlock>
        {user.routines.map((routine) => (
          <RoutineItem
            key={routine.routineId}
            routine={routine}
            isVisible={visible === routine.routineId}
            isEditing={editing === routine.routineId}
            onOpenModal={onOpenModal}
            onSetVisible={onSetVisible}
            onSetEditing={onSetEditing}
          />
        ))}
      </RoutineListBlock>
      <AddRoutineButton onClick={onAddRoutine}>
        <BsPlusCircleDotted />
        <b>루틴 추가</b>
      </AddRoutineButton>
      <ErrorMessage message={message} />
    </Template>
  );
};

export default React.memo(RoutinePage);
