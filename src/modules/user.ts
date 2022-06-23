import { createSlice } from '@reduxjs/toolkit';
import { ExerciseItem } from 'modules/routine';
import { Routine } from './routine';

export type CompleteItem = {
  date: string;
  list: ExerciseItem[];
  memo: string;
};

export type ProgressPayload = {
  date: string;
  weight: number;
  muscleMass: number;
  fatMass: number;
};

export type ProgressItem = {
  id: 'weight' | 'muscleMass' | 'fatMass';
  color: string;
  data: {
    x: string;
    y: number;
  }[];
};

export type UserStateType = {
  name: string;
  gender: string;
  birth: string;
  height: number;
  currentRoutine: Routine | null;
  completes: CompleteItem[];
  progress: ProgressItem[];
};

const initialState: UserStateType = {
  name: '',
  gender: '',
  birth: '',
  height: 0,
  currentRoutine: null,
  completes: [],
  progress: [
    {
      id: 'weight',
      color: '#123456',
      data: [],
    },
    {
      id: 'muscleMass',
      color: '#234567',
      data: [],
    },
    {
      id: 'fatMass',
      color: '#345678',
      data: [],
    },
  ],
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (
      state,
      {
        payload,
      }: {
        payload: {
          name: string;
          gender: string;
          birth: string;
          height: number;
        };
      },
    ) => {
      state.name = payload.name;
      state.birth = payload.birth;
      state.gender = payload.gender;
      state.height = payload.height;
    },
    setCurrentRoutine: (state, { payload }: { payload: Routine | null }) => {
      state.currentRoutine = payload;
    },
    addCompleteDay: (state, { payload }: { payload: CompleteItem }) => {
      state.completes.push(payload);
    },
    addProgress: (state, { payload }: { payload: ProgressPayload }) => {
      state.progress.map((item) =>
        item.data.push({
          x: payload.date,
          y: payload[item.id],
        }),
      );
    },
    removeProgress: (state, { payload }: { payload: string }) => {
      state.progress.forEach((item) => {
        item.data = item.data.filter((a) => a.x !== payload);
      });
    },
  },
});

export const {
  setUser,
  setCurrentRoutine,
  addCompleteDay,
  addProgress,
  removeProgress,
} = userSlice.actions;

export default userSlice.reducer;
