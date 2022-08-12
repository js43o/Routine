import { useReducer, useCallback } from 'react';
import { Exercise } from 'types';

type State = {
  category: string;
  selected: Exercise | null;
  inputs: {
    weight: number;
    numberOfTimes: number;
    numberOfSets: number;
  };
};

type Action =
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_SELECTED'; payload: Exercise | null }
  | {
      type: 'CHANGE_WEIGHT' | 'CHANGE_NUM_OF_TIMES' | 'CHANGE_NUM_OF_SETS';
      payload: number;
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_SELECTED':
      return { ...state, selected: action.payload };
    case 'CHANGE_WEIGHT':
      return { ...state, inputs: { ...state.inputs, weight: action.payload } };
    case 'CHANGE_NUM_OF_TIMES':
      return {
        ...state,
        inputs: { ...state.inputs, numberOfTimes: action.payload },
      };
    case 'CHANGE_NUM_OF_SETS':
      return {
        ...state,
        inputs: { ...state.inputs, numberOfSets: action.payload },
      };
    default:
      return state;
  }
};

const useAddExercise = () => {
  const [state, dispatch] = useReducer(reducer, {
    category: 'all',
    selected: null,
    inputs: {
      weight: 0,
      numberOfTimes: 0,
      numberOfSets: 0,
    },
  });

  const onSelectExercise = useCallback(
    (exercise: Exercise) =>
      dispatch({ type: 'SET_SELECTED', payload: exercise }),
    [],
  );

  const onChangeInput = useCallback(
    (
      type: 'CHANGE_WEIGHT' | 'CHANGE_NUM_OF_TIMES' | 'CHANGE_NUM_OF_SETS',
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      if (e.target.value.length > 1 && e.target.value[0] === '0')
        e.target.value = e.target.value.slice(1);

      if (e.target.value.length > 3) return;
      dispatch({
        type,
        payload: +e.target.value,
      });
    },
    [],
  );

  const onSetCategory = useCallback(
    (str: string) => dispatch({ type: 'SET_CATEGORY', payload: str }),
    [],
  );

  const checkInputs = useCallback(() => {
    if (!state.selected) {
      return '운동 종류를 선택하세요.';
    }
    if (
      !state.inputs.weight ||
      !state.inputs.numberOfTimes ||
      !state.inputs.numberOfSets
    ) {
      return '정확한 값을 입력하세요.';
    }
    if (state.inputs.numberOfSets > 20) {
      return '최대 세트 수는 20입니다.';
    }
    return '';
  }, [state.selected, state.inputs]);

  return {
    addState: state,
    onSetCategory,
    onSelectExercise,
    onChangeInput,
    checkInputs,
  };
};

export default useAddExercise;
