import { createSlice } from '@reduxjs/toolkit';
import { ExerciseItem, PerformList } from 'types';
import { PURGE } from 'redux-persist';

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
      {
        payload: { lastModified, exerciseList },
      }: { payload: { lastModified: number; exerciseList: ExerciseItem[] } },
    ) => {
      state.lastModified = lastModified;
      // eslint-disable-next-line no-param-reassign
      state.list = exerciseList.map((r) => ({
        exercise: r,
        setCheck: [...Array(r.numberOfSets)].map(() => false),
      }));
    },
    toggleCheck: (
      state,
      {
        payload: { exerIdx, setIdx },
      }: { payload: { exerIdx: number; setIdx: number } },
    ) => {
      const exer = state.list[exerIdx];
      if (!exer) return;

      if (!exer.setCheck[setIdx] && (setIdx === 0 || exer.setCheck[setIdx - 1]))
        exer.setCheck[setIdx] = !exer.setCheck[setIdx];
      else if (
        exer.setCheck[setIdx] &&
        (setIdx === exer.setCheck.length - 1 || !exer.setCheck[setIdx + 1])
      )
        exer.setCheck[setIdx] = !exer.setCheck[setIdx];
    },
    checkAll: (
      state,
      { payload: { exerIdx } }: { payload: { exerIdx: number } },
    ) => {
      const exer = state.list[exerIdx];
      exer.setCheck = exer.setCheck.map(() => true);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { initialPerform, toggleCheck, checkAll } = performSlice.actions;

export default performSlice.reducer;
