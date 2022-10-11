import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { initializeUser } from 'modules/user';
import { userSelector, themeSelector } from 'modules/hooks';
import GlobalStyles from 'templates/GlobalStyles';
import LoadingIndicator from 'components/common/LoadingIndicator';
import HomePage from 'pages/Home';
import RoutinePage from 'pages/Routine';
import RecordPage from 'pages/Record';
import AuthPage from 'pages/Auth';
import KakaoPage from 'pages/Kakao';

const LoadingBlock = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  place-items: center;
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
  const { loading, error, user } = useSelector(userSelector);
  const theme = useSelector(themeSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname !== '/kakao' && !user.username) {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    if (error && error.code === 'ERR_BAD_REQUEST') {
      alert('서버와의 연결이 끊겼습니다.\n다시 로그인해주세요.');
      dispatch(initializeUser());
      navigate('/login');
    }
  }, [error]);

  return (
    <AppBlock>
      <LoadingBlock visible={loading}>
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
