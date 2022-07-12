import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { css, Global, ThemeProvider, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { themeSelector } from 'modules/hooks';
import { globalStyles } from 'lib/globalStyles';
import HomePage from 'pages/Home';
import RoutinePage from 'pages/Routine';
import RecordPage from 'pages/Record';
import AuthPage from 'pages/Auth';
import { userSelector } from './modules/hooks';

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
  const { user } = useSelector(userSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.username) {
      navigate('/login');
    }
  }, [user]);

  return (
    <AppBlock>
      <ThemeProvider theme={theme.colors}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/register" element={<AuthPage type="register" />} />
          <Route path="/login" element={<AuthPage type="login" />} />
        </Routes>
      </ThemeProvider>
    </AppBlock>
  );
}

export default App;
