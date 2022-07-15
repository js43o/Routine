import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { useInView } from 'react-intersection-observer';
import { addExercise } from 'modules/user';
import { Exercise, ExerciseItem } from 'types';
import Button from 'components/common/Button';
import SubmitButtons from 'components/common/SubmitButtons';
import ErrorMessage from 'components/common/ErrorMessage';
import useAddExercise from 'hooks/useAddExercise';
import { getExercises } from 'lib/api';

const AddExerciseWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  place-items: center;
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
  align-items: center;
  z-index: 100;
  top: ${({ visible }) => (visible ? '5%' : '100%')};
  left: 5%;
  position: fixed;
  max-width: 430px;
  width: 90%;
  height: 90%;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.background_main};
  overflow: hidden;
  transition: top 0.5s;
  h2 {
    align-self: center;
  }
  @media (min-width: 540px) {
    left: ${({ offset }) => offset / 2 - 215}px;
  }
`;

const CategoryListBlock = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
`;

const CategoryItemBlock = styled(Button)<{ checked: number }>`
  padding: 0.25rem;
  border: 1px solid
    ${({ checked, theme }) => (checked ? theme.primary : theme.border_main)};
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
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const ConfirmBlock = styled.div`
  display: flex;
  gap: 0.5rem;
  div {
    display: grid;
    place-items: center;
    input {
      font-size: 2rem;
      width: 5rem;
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
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const {
    addState,
    onSetCategory,
    onSelectExercise,
    onChangeInput,
    checkInputs,
  } = useAddExercise();
  const [ref, inView] = useInView();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const page = useRef(1);
  const maxPage = useRef<number | null>(null);

  const onAddExercise = () => {
    if (!routineId || day === null) return;
    const error = checkInputs();
    if (error) {
      setMessage(error);
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
    setMessage('');
    onCloseModal();
  };

  const onLoadExercise = async () => {
    if (!inView || (maxPage.current && maxPage.current < page.current)) return;
    try {
      const response = await getExercises(page.current, addState.category);
      setExercises([...exercises, ...response.data]);
      maxPage.current = +response.headers['last-page'];
      page.current += 1;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onLoadExercise();
  }, [inView, exercises]);

  useEffect(() => {
    setExercises([]);
    page.current = 1;
    maxPage.current = null;
    addState.selected = null;
  }, [addState.category]);

  return (
    <AddExerciseWrapper visible={visible}>
      <AddExerciseBlock visible={visible} offset={offset}>
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
        <ExerciseListBlock>
          {exercises.map((exer) => (
            <ExerciseItemBlock
              onClick={() => onSelectExercise(exer)}
              isSelected={addState.selected === exer ? 1 : 0}
              key={exer.name}
            >
              <b>{exer.name}</b>
              <div>
                {exer.part.map((item) => (
                  <span>#{item} </span>
                ))}
              </div>
            </ExerciseItemBlock>
          ))}
          <div ref={ref} />
        </ExerciseListBlock>
        <FooterBlock>
          <ConfirmBlock>
            <div className="weight">
              <b>중량</b>
              <input
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
                type="number"
                min={0}
                max={20}
                value={addState.inputs.numberOfSets}
                onChange={(e) => onChangeInput('CHANGE_NUM_OF_SETS', e)}
              />
              세트
            </div>
          </ConfirmBlock>
          <SubmitButtons onSubmit={onAddExercise} onClose={onClose} />
          <ErrorMessage message={message} />
        </FooterBlock>
      </AddExerciseBlock>
    </AddExerciseWrapper>
  );
};

export default React.memo(AddExerciseModal);
