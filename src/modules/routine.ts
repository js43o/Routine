import { createSlice } from '@reduxjs/toolkit';

export type Exercise = {
  name: string;
  category: string[];
  part: string[];
  imageSrc?: string;
  description?: string;
};

export type ExerciseItem = {
  exercise: string;
  weight: number;
  numberOfTimes: number;
  numberOfSets: number;
};

export type Routine = {
  routineId: string;
  title: string;
  lastModified: number;
  weekRoutine: [
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
  ];
};

const initialState: Routine[] = [];

export const routineSlice = createSlice({
  name: 'routines',
  initialState,
  reducers: {
    changeTitle: (
      state,
      {
        payload: { routineId, value },
      }: { payload: { routineId: string; value: string } },
    ) => {
      const r = state.find((s) => s.routineId === routineId);
      if (!r) return;
      r.title = value;
    },
    initializeRoutine: (state, { payload }: { payload: Routine[] }) => {
      return payload;
    },
    addRoutine: (state, { payload }: { payload: Routine }) => {
      state.push(payload);
    },
    removeRoutine: (state, { payload }: { payload: string }) => {
      return state.filter((routine) => routine.routineId !== payload);
    },
    addExercise: (
      state,
      {
        payload: { routineId, day, exercise },
      }: {
        payload: { routineId: string; day: number; exercise: ExerciseItem };
      },
    ) => {
      const r = state.find((s) => s.routineId === routineId);
      if (!r) return;
      const d = r.weekRoutine[day];
      if (!d) return;
      r.weekRoutine[day] = [...d, exercise];
      r.lastModified = Date.now();
    },
    removeExercise: (
      state,
      {
        payload: { routineId, day, idx },
      }: { payload: { routineId: string; day: number; idx: number } },
    ) => {
      const r = state.find((s) => s.routineId === routineId);
      if (!r) return;
      const d = r.weekRoutine[day];
      if (!d) return;
      r.weekRoutine[day] = d.filter((_, i) => i !== idx);
      r.lastModified = Date.now();
    },
    insertExercise: (
      state,
      {
        payload: { routineId, day, fromIdx, toIdx },
      }: {
        payload: {
          routineId: string;
          day: number;
          fromIdx: number;
          toIdx: number;
        };
      },
    ) => {
      const r = state.find((s) => s.routineId === routineId);
      if (!r) return;
      const d = r.weekRoutine[day];
      if (!d) return;
      const filtered = d.filter((_, i) => i !== fromIdx);
      r.weekRoutine[day] = [
        ...filtered.slice(0, toIdx),
        d[fromIdx],
        ...filtered.slice(toIdx),
      ];
      r.lastModified = Date.now();
    },
  },
});

export const {
  changeTitle,
  initializeRoutine,
  addRoutine,
  removeRoutine,
  addExercise,
  removeExercise,
  insertExercise,
} = routineSlice.actions;

export default routineSlice.reducer;
