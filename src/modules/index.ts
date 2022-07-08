import { combineReducers, configureStore } from '@reduxjs/toolkit';
import user from './user';
import perform from './perform';
import theme from './theme';

const reducers = combineReducers({
  user,
  perform,
  theme,
});

const store = configureStore({
  reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
