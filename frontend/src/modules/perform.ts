import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseItem, PerformList } from 'types';

const initialState: PerformList = {
  lastModified: null,
  list: [],
};

export const performSlice = createSlice({
  name: 'performs',
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
      state.list = exerciseList.map((r) => ({
        exercise: r,
        setCheck: [...Array(r.numberOfSets)].map(() => false),
      }));
    },
    toggleCheck: (
      state,
      action: PayloadAction<{ exerciseIdx: number; setIdx: number }>,
    ) => {
      const { exerciseIdx, setIdx } = action.payload;
      const exer = state.list[exerciseIdx];
      if (!exer) return;

      if (!exer.setCheck[setIdx] && (setIdx === 0 || exer.setCheck[setIdx - 1]))
        exer.setCheck[setIdx] = !exer.setCheck[setIdx];
      else if (
        exer.setCheck[setIdx] &&
        (setIdx === exer.setCheck.length - 1 || !exer.setCheck[setIdx + 1])
      )
        exer.setCheck[setIdx] = !exer.setCheck[setIdx];
    },
    checkAll: (state, action: PayloadAction<{ exerciseIdx: number }>) => {
      const { exerciseIdx } = action.payload;
      const exer = state.list[exerciseIdx];
      exer.setCheck = exer.setCheck.map(() => true);
    },
  },
});

export const { initialPerform, toggleCheck, checkAll } = performSlice.actions;

export default performSlice.reducer;
