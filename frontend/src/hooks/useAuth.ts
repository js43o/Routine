import { useReducer, useCallback } from 'react';
import { regexp } from 'lib/constants';

type State = {
  username: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  inputCondition: {
    username: {
      allowedCharacter: boolean;
      allowedLength: boolean;
    };
    password: {
      allowedCharacter: boolean;
      allowedLength: boolean;
    };
    nickname: {
      allowedCharacter: boolean;
      allowedLength: boolean;
    };
  };
};

const initialState: State = {
  username: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
  inputCondition: {
    username: {
      allowedCharacter: false,
      allowedLength: false,
    },
    password: {
      allowedCharacter: false,
      allowedLength: false,
    },
    nickname: {
      allowedCharacter: false,
      allowedLength: false,
    },
  },
};

type Action =
  | {
      type: 'INITIALIZE';
    }
  | {
      type: 'CHANGE_FIELD';
      payload: { field: string; value: string };
    }
  | {
      type: 'CHECK_CONDITION';
      payload: { field: string; value: { [x: string]: boolean } };
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return initialState;
    case 'CHANGE_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'CHECK_CONDITION':
      return {
        ...state,
        inputCondition: {
          ...state.inputCondition,
          [action.payload.field]: action.payload.value,
        },
      };
    default:
      return state;
  }
};

const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const checkInputs = (
    type: 'username' | 'password' | 'nickname',
    str: string,
  ) => {
    switch (type) {
      case 'username':
        dispatch({
          type: 'CHECK_CONDITION',
          payload: {
            field: 'username',
            value: {
              allowedCharacter: regexp.username.test(str),
              allowedLength: str.length >= 5 && str.length <= 20,
            },
          },
        });
        break;
      case 'password':
        dispatch({
          type: 'CHECK_CONDITION',
          payload: {
            field: 'password',
            value: {
              allowedCharacter: regexp.password.test(str),
              allowedLength: str.length >= 8 && str.length <= 20,
            },
          },
        });
        break;
      case 'nickname':
        dispatch({
          type: 'CHECK_CONDITION',
          payload: {
            field: 'nickname',
            value: {
              allowedCharacter: regexp.nickname.test(str),
              allowedLength: str.length >= 1 && str.length <= 10,
            },
          },
        });
        break;
      default:
        break;
    }
  };

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
      if (field !== 'passwordConfirm') checkInputs(field, e.target.value);
    },
    [],
  );

  return {
    state,
    onChangeInput,
  };
};

export default useAuth;
