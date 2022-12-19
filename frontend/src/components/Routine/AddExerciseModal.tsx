import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { addExercise } from 'modules/user';
import { Exercise, ExerciseItem } from 'types';
import Button from 'components/common/Button';
import SubmitButtons from 'components/common/SubmitButtons';
import useErrorMessage from 'hooks/useErrorMessage';
import useAddExercise from 'hooks/useAddExercise';
import { getExercises } from 'lib/api';
import LoadingIndicator from 'components/common/LoadingIndicator';
import ErrorMessage from 'components/common/ErrorMessage';
import Modal from 'components/common/Modal';
import InputConfirm from 'components/common/InputConfirm';

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border_main};
  input {
    width: 100%;
  }
`;

const CategoryListBlock = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
  width: 100%;
`;

const CategoryItemBlock = styled(Button)<{ checked: number }>`
  padding: 0.25rem;
  border: 1px solid
    ${({ checked, theme }) => (checked ? 'transparent' : theme.border_main)};
  background: ${({ checked, theme }) =>
    checked ? theme.primary : theme.background_main};
  color: ${({ checked, theme }) =>
    checked ? theme.letter_primary : theme.letter_main};
`;

const ExerciseListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: 100%;
  padding: 0.25rem;
  background: ${({ theme }) => theme.background_sub};
  overflow-y: scroll;
`;

const ExerciseItemBlock = styled.li<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.primary : theme.background_main};
  color: ${({ isSelected, theme }) => isSelected && theme.letter_primary};
  span {
    color: ${({ isSelected, theme }) =>
      isSelected ? theme.letter_main : theme.letter_sub};
  }
`;

const FooterBlock = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  border-top: 1px solid ${({ theme }) => theme.border_main};
`;

type AddExerciseProps = {
  routineId: string | null;
  day: number | null;
  visible: boolean;
  onCloseModal: () => void;
};

const AddExerciseModal = ({
  routineId,
  day,
  visible,
  onCloseModal,
}: AddExerciseProps) => {
  const dispatch = useDispatch();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState('');

  const {
    addState,
    onSetCategory,
    onSelectExercise,
    onChangeInput,
    checkInputs,
  } = useAddExercise();
  const { message, onError, resetError } = useErrorMessage();

  const onAddExercise = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!routineId || day === null) return;

    const error = checkInputs();
    if (error) {
      onError(error);
      return;
    }

    const exercise: ExerciseItem = {
      exercise: addState.selected as string,
      weight: addState.inputs.weight,
      numberOfTimes: addState.inputs.numberOfTimes,
      numberOfSets: addState.inputs.numberOfSets,
    };
    dispatch(addExercise({ routineId, day, exercise }));
    onClose();
  };

  const onClose = () => {
    resetError();
    onCloseModal();
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const response = await getExercises();
        setExercises(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    loadExercise();
  }, []);

  return (
    <Modal visible={visible}>
      <HeaderBlock>
        <h2>운동 목록</h2>
        <CategoryListBlock>
          <CategoryItemBlock
            checked={addState.category === 'all' ? 1 : 0}
            onClick={() => onSetCategory('all')}
          >
            전체
          </CategoryItemBlock>
          <CategoryItemBlock
            checked={addState.category === 'upper' ? 1 : 0}
            onClick={() => onSetCategory('upper')}
          >
            상체
          </CategoryItemBlock>
          <CategoryItemBlock
            checked={addState.category === 'lower' ? 1 : 0}
            onClick={() => onSetCategory('lower')}
          >
            하체
          </CategoryItemBlock>
          <CategoryItemBlock
            checked={addState.category === 'core' ? 1 : 0}
            onClick={() => onSetCategory('core')}
          >
            코어
          </CategoryItemBlock>
        </CategoryListBlock>
        <input
          type="text"
          onChange={onChangeName}
          value={name}
          placeholder="이름으로 찾기..."
        />
      </HeaderBlock>
      {exercises.length > 0 ? (
        <ExerciseListBlock>
          {exercises
            .filter((exer) =>
              addState.category === 'all'
                ? true
                : exer.category.includes(addState.category),
            )
            .filter((exer) =>
              exer.name.replaceAll(' ', '').includes(name.replaceAll(' ', '')),
            )
            .map((exer) => (
              <ExerciseItemBlock
                onClick={() => onSelectExercise(exer)}
                isSelected={addState.selected === exer.name}
                key={exer.name}
              >
                <b>{exer.name}</b>
                <div>
                  {exer.part.map((item) => (
                    <span key={item}>#{item} </span>
                  ))}
                </div>
              </ExerciseItemBlock>
            ))}
        </ExerciseListBlock>
      ) : (
        <LoadingIndicator />
      )}
      <FooterBlock>
        <InputConfirm onSubmit={onAddExercise}>
          <div className="weight">
            <b>중량</b>
            <input
              className="count"
              type="number"
              min={0}
              max={999}
              value={addState.inputs.weight}
              onChange={(e) => onChangeInput('CHANGE_WEIGHT', e)}
            />
            kg
          </div>
          <div className="numOfTimes">
            <b>횟수</b>
            <input
              className="count"
              type="number"
              min={0}
              max={999}
              value={addState.inputs.numberOfTimes}
              onChange={(e) => onChangeInput('CHANGE_NUM_OF_TIMES', e)}
            />
            회
          </div>
          <div className="numOfSets">
            <b>세트 수</b>
            <input
              className="count"
              type="number"
              min={0}
              max={20}
              value={addState.inputs.numberOfSets}
              onChange={(e) => onChangeInput('CHANGE_NUM_OF_SETS', e)}
            />
            세트
          </div>
          <SubmitButtons onClose={onClose} />
        </InputConfirm>
        <ErrorMessage message={message} />
      </FooterBlock>
    </Modal>
  );
};

export default React.memo(AddExerciseModal);
