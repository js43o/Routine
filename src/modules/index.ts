import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user, { User } from './user';
import routine, { Routine } from './routine';
import perform from './perform';
import theme from './theme';

const reducers = combineReducers({
  user,
  routine,
  perform,
  theme,
});

const store = configureStore({
  reducer: reducers,
});

export type UserPayload = User & { routine: Routine[] };

export type RootState = ReturnType<typeof store.getState>;

export default store;
