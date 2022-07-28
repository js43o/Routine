import { useReducer, useCallback } from 'react';

type State = {
  inputs: {
    username: string;
    password: string;
    passwordConfirm: string;
  };
};

const initialState: State = {
  inputs: {
    username: '',
    password: '',
    passwordConfirm: '',
  },
};

type Action =
  | {
      type: 'CHANGE_USERNAME' | 'CHANGE_PASSWORD' | 'CHANGE_PASSWORD_CONFIRM';
      payload: string;
    }
  | {
      type: 'INITIALIZE';
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return initialState;
    case 'CHANGE_USERNAME':
      return {
        ...state,
        inputs: { ...state.inputs, username: action.payload },
      };
    case 'CHANGE_PASSWORD':
      return {
        ...state,
        inputs: { ...state.inputs, password: action.payload },
      };
    case 'CHANGE_PASSWORD_CONFIRM':
      return {
        ...state,
        inputs: { ...state.inputs, passwordConfirm: action.payload },
      };
    default:
      return state;
  }
};

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeInput = useCallback(
    (
      type: 'USERNAME' | 'PASSWORD' | 'PASSWORD_CONFIRM',
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      dispatch({
        type: `CHANGE_${type}`,
        payload: e.target.value,
      });
    },
    [],
  );

  const onCheckInputs = (str: string, type: 'username' | 'password') =>
    type === 'username'
      ? /[A-Za-z\d_-]{5,20}/.test(str)
      : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]){8,20}/.test(str);

  return {
    state,
    onChangeInput,
    onCheckInputs,
  };
};

export default useAuth;
