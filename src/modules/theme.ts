import { createSlice } from '@reduxjs/toolkit';

type Theme = {
  mode: 'light' | 'dark';
  colors: {
    [x: string]: string;
  };
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    body: '#f5f5f5',
    background_main: 'white',
    background_sub: '#eeeeee',
    border_main: '#cccccc',
    border_primary: '#67e6c0',
    letter_main: 'black',
    letter_sub: '#5a5d5f',
    letter_primary: 'white',
    primary: '#009990',
    secondary: '#FEF37C',
    memo_body: '#fffed5',
    red: '#df2323',
    yellow: '#ffd900',
    blue: '#1d2adb',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    body: '#111111',
    background_main: 'black',
    background_sub: '#444444',
    border_main: '#666666',
    border_primary: '#466159',
    letter_main: '#eeeeee',
    letter_sub: '#aaaaaa',
    letter_primary: '#eeeeee',
    primary: '#8000ff',
    secondary: '#000cff',
    memo_body: '#171f41',
    red: '#ff5978',
    yellow: '#ffd900',
    blue: '#41c7df',
  },
};

const initialState = lightTheme;

export const themeSlice = createSlice({
  name: 'themes',
  initialState,
  reducers: {
    toggleTheme: (state) => (state.mode === 'light' ? darkTheme : lightTheme),
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
