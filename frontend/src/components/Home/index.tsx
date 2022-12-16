import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { userSelector } from 'modules/hooks';
import Template from 'templates/Template';
import PerformRoutine from 'components/Home/PerformRoutine';
import { getDatestr } from 'lib/methods';
import CompleteDayBar from 'components/Home/CompleteDayBar';
import Profile from 'components/Home/Profile';

const TodayExerciseHeader = styled.div`
  display: flex;
  justify-content: center;
  @media (min-width: 430px) {
    justify-content: start;
  }
`;

const CompleteText = styled.div`
  display: flex;
  align-items: center;
  span {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    margin-left: 0.5rem;
    color: black;
    background: ${({ theme }) => theme.yellow};
    font-weight: bold;
  }
`;

const HomePage = () => {
  const { user } = useSelector(userSelector);
  const isCompleted = useMemo(
    () =>
      user.completes.filter((c) => c.date === getDatestr(new Date())).length >
      0,
    [user.completes],
  );

  if (!user.username) return <Template> </Template>;

  return (
    <Template>
      <Profile user={user} />
      <h1>이번 주 운동 현황</h1>
      <CompleteDayBar completes={user.completes} />
      <TodayExerciseHeader>
        <h1>오늘의 운동</h1>
        <CompleteText>{isCompleted ? <span>완료</span> : null}</CompleteText>
      </TodayExerciseHeader>
      <PerformRoutine
        currentRoutineId={user.currentRoutineId}
        complete={isCompleted}
      />
    </Template>
  );
};

export default HomePage;
