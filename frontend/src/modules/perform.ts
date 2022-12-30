import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseItem, PerformList } from 'types';

const initialState: PerformList = {
  lastModified: null,
  list: [],
};

export const performSlice = createSlice({
  name: 'perform',
  initialState,
  reducers: {
    initialPerform: (
      state,
      action: PayloadAction<{
        lastModified: number;
        exerciseList: ExerciseItem[];
      }>,
    ) => {
      const { lastModified, exerciseList } = action.payload;
      state.lastModified = lastModified;
      state.list = exerciseList.map((exercise) => ({
        exercise,
        setCheck: [...Array(exercise.numberOfSets)].map(() => false),
      }));
    },
    toggleCheck: (
      state,
      action: PayloadAction<{ exerciseIdx: number; setIdx: number }>,
    ) => {
      const { exerciseIdx, setIdx } = action.payload;
      const exercise = state.list[exerciseIdx];
      if (!exercise) return;

      if (
        !exercise.setCheck[setIdx] &&
        (setIdx === 0 || exercise.setCheck[setIdx - 1])
      )
        exercise.setCheck[setIdx] = !exercise.setCheck[setIdx];
      else if (
        exercise.setCheck[setIdx] &&
        (setIdx === exercise.setCheck.length - 1 ||
          !exercise.setCheck[setIdx + 1])
      )
        exercise.setCheck[setIdx] = !exercise.setCheck[setIdx];
    },
    checkAll: (state, action: PayloadAction<{ exerciseIdx: number }>) => {
      const { exerciseIdx } = action.payload;
      const exercise = state.list[exerciseIdx];
      exercise.setCheck = exercise.setCheck.map(() => true);
    },
  },
});

export const { initialPerform, toggleCheck, checkAll } = performSlice.actions;

export default performSlice.reducer;
