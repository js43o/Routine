import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { initializeUser } from 'modules/user';
import { userSelector, themeSelector } from 'modules/hooks';
import GlobalStyles from 'templates/GlobalStyles';
import LoadingIndicator from 'components/common/LoadingIndicator';
import HomePage from 'components/Home';
import RoutinePage from 'components/Routine';
import RecordPage from 'components/Record';
import AuthPage from 'components/Auth';
import KakaoPage from 'components/Auth/Kakao';
import errorMessageMap from 'lib/errorMessageMap';

const LoadingBlock = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.2s;
`;

const AppBlock = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  @media (min-width: 430px) {
    padding: 1rem;
  }
`;

function App() {
  const { user, authLoading, error } = useSelector(userSelector);
  const theme = useSelector(themeSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname !== '/kakao' && !user.username) {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    if (
      !error ||
      window.location.pathname === '/login' ||
      window.location.pathname === '/register'
    )
      return;

    alert(errorMessageMap.get(error.code));

    dispatch(initializeUser());
    navigate('/login');
  }, [error]);

  return (
    <AppBlock>
      <LoadingBlock visible={authLoading}>
        <LoadingIndicator white />
      </LoadingBlock>
      <ThemeProvider theme={theme.colors}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/register" element={<AuthPage type="register" />} />
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/kakao" element={<KakaoPage />} />
        </Routes>
      </ThemeProvider>
    </AppBlock>
  );
}

export default App;
