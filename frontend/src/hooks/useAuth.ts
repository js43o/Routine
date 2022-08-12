import { useReducer, useCallback } from 'react';

type State = {
  username: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

const initialState: State = {
  username: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
};

type Action =
  | {
      type: 'INITIALIZE';
    }
  | {
      type: 'CHANGE_FIELD';
      payload: { field: string; value: string };
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return initialState;
    case 'CHANGE_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    default:
      return state;
  }
};

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeInput = useCallback(
    (
      field: 'username' | 'password' | 'passwordConfirm' | 'nickname',
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      dispatch({
        type: 'CHANGE_FIELD',
        payload: {
          field,
          value: e.target.value,
        },
      });
    },
    [],
  );

  const onCheckInputs = (
    str: string,
    type: 'username' | 'password' | 'nickname',
  ) => {
    switch (type) {
      case 'username':
        return /^[A-Za-z\d_-]{5,20}/.test(str);
      case 'password':
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]){8,20}/.test(str);
      case 'nickname':
        return /^[ㄱ-ㅎ가-힇A-Za-z\d]{1,10}/.test(str);
      default:
        return false;
    }
  };

  return {
    state,
    onChangeInput,
    onCheckInputs,
  };
};

export default useAuth;
