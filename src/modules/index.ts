import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, REGISTER, PERSIST, REHYDRATE } from 'redux-persist';
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

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REGISTER, PERSIST, REHYDRATE],
      },
    }),
});

export type UserPayload = User & { routine: Routine[] };

export type RootState = ReturnType<typeof store.getState>;

export default store;
