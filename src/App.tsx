import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from '@emotion/styled';
import { css, Global, ThemeProvider, useTheme } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from 'modules/user';
import { themeSelector } from 'modules/hooks';
import { globalStyles } from 'lib/globalStyles';
import HomePage from 'pages/Home';
import RoutinePage from 'pages/Routine';
import RecordPage from 'pages/Record';

const AppBlock = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  @media (min-width: 430px) {
    padding: 1rem;
  }
`;

const GlobalStyles = () => {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        ${globalStyles};
        body {
          background: ${theme.body};
          color: ${theme.letter_main};
        }
        input,
        textArea,
        button {
          color: ${theme.letter_main};
          background: ${theme.background_sub};
        }
      `}
    />
  );
};

function App() {
  const theme = useSelector(themeSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login({ username: 'js43o', password: '123' }));
  }, []);

  return (
    <AppBlock>
      <ThemeProvider theme={theme.colors}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/record" element={<RecordPage />} />
        </Routes>
      </ThemeProvider>
    </AppBlock>
  );
}

export default App;
