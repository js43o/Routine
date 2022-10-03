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

const AddExerciseWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.5s;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;

const AddExerciseBlock = styled.div<{ visible: boolean; offset: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: ${({ visible }) => (visible ? '5%' : '100%')};
  z-index: 100;
  width: 90%;
  max-width: 430px;
  height: 90%;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  overflow: hidden;
  transition: top 0.5s;
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border_main};
  input {
    width: 100%;
    font-size: 1.125rem;
  }
`;

const CategoryListBlock = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  width: 100%;
`;

const CategoryItemBlock = styled(Button)<{ checked: number }>`
  padding: 0.125rem;
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
  width: 100%;
  height: 100%;
  padding: 0.25rem;
  background: ${({ theme }) => theme.background_sub};
  overflow-y: scroll;
`;

const ExerciseItemBlock = styled.li<{ isSelected: number }>`
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
  .error {
    justify-self: end;
  }
`;

const ConfirmBlock = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.5rem;
  .weight,
  .numOfTimes,
  .numOfSets {
    display: flex;
    flex-direction: column;
    place-items: center;
    input {
      font-size: 1.5rem;
      width: 3.5rem;
      @media (min-width: 430px) {
        font-size: 2rem;
        width: 4rem;
      }
    }
  }
  .buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    @media (min-width: 430px) {
      flex-direction: row;
      button {
        font-size: 1.25rem;
      }
    }
  }
`;

type AddExerciseProps = {
  routineId: string | null;
  day: number | null;
  visible: boolean;
  offset: number;
  onCloseModal: () => void;
};

const AddExerciseModal = ({
  routineId,
  day,
  visible,
  offset,
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
      exercise: (addState.selected as Exercise).name,
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
    <AddExerciseWrapper visible={visible}>
      <AddExerciseBlock visible={visible} offset={offset}>
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
                  ? 1
                  : exer.category.includes(addState.category),
              )
              .filter((exer) =>
                exer.name
                  .replaceAll(' ', '')
                  .includes(name.replaceAll(' ', '')),
              )
              .map((exer) => (
                <ExerciseItemBlock
                  onClick={() => onSelectExercise(exer)}
                  isSelected={addState.selected === exer ? 1 : 0}
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
          <ConfirmBlock onSubmit={onAddExercise}>
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
          </ConfirmBlock>
          <ErrorMessage message={message} />
        </FooterBlock>
      </AddExerciseBlock>
    </AddExerciseWrapper>
  );
};

export default React.memo(AddExerciseModal);
