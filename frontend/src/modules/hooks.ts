import { RootState } from 'modules';

export const userSelector = (state: RootState) => state.user;
export const performSelector = (state: RootState) => state.perform;
export const themeSelector = (state: RootState) => state.theme;
