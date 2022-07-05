import { createSlice } from '@reduxjs/toolkit';
import { ExerciseItem } from 'modules/routine';

export type CompleteItem = {
  date: string;
  list: ExerciseItem[];
  memo: string;
};

export type ProgressItem = {
  id: 'weight' | 'muscleMass' | 'fatMass';
  color: string;
  data: {
    x: string;
    y: number;
  }[];
};

export type ProgressPayload = {
  date: string;
  weight: number;
  muscleMass: number;
  fatMass: number;
};

export type User = {
  username: string;
  name: string;
  gender: string;
  birth: string;
  height: number;
  currentRoutineId: string;
  completes: CompleteItem[];
  progress: ProgressItem[];
};

const initialState: User = {
  username: '',
  name: '',
  gender: '',
  birth: '',
  height: 0,
  currentRoutineId: '',
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
    setUserInfo: (
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
    setCurrentRoutine: (state, { payload }: { payload: string }) => {
      state.currentRoutineId = payload;
    },
    initializeCompleteDay: (
      state,
      { payload }: { payload: CompleteItem[] },
    ) => {
      state.completes = payload;
    },
    addCompleteDay: (state, { payload }: { payload: CompleteItem }) => {
      state.completes.push(payload);
    },
    initializeProgress: (state, { payload }: { payload: ProgressItem[] }) => {
      state.progress = payload;
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
  setUserInfo,
  setCurrentRoutine,
  initializeCompleteDay,
  addCompleteDay,
  initializeProgress,
  addProgress,
  removeProgress,
} = userSlice.actions;

export default userSlice.reducer;
