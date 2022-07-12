import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import user from './user';
import perform from './perform';
import theme from './theme';

const persistConfig = {
  key: 'root',
  storage,
};

const reducers = combineReducers({
  user,
  perform,
  theme,
});

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
