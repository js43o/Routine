import React from 'react';
import styled from '@emotion/styled';
import { CompleteItem } from 'types';

const ExerciseHistoryBlock = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_sub};
  text-align: center;
`;

const ExerciseHistoryItem = styled.li`
  display: flex;
  flex-direction: column;
  place-items: center;
  flex-grow: 1;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  text-align: center;
`;

type ExerciseHistoryProps = {
  complete: CompleteItem | null;
};

const ExerciseHistory = ({ complete }: ExerciseHistoryProps) => {
  if (!complete || complete.exerciseList.length <= 0)
    return (
      <ExerciseHistoryBlock>
        <li>
          <i>수행한 운동이 없습니다.</i>
        </li>
      </ExerciseHistoryBlock>
    );

  return (
    <ExerciseHistoryBlock>
      {complete.exerciseList.map((exercise, idx) => (
        <ExerciseHistoryItem key={idx}>
          <b>{exercise.name}</b>
          <small>
            {exercise.weight}kg, {exercise.numberOfTimes}x
            {exercise.numberOfSets}
          </small>
        </ExerciseHistoryItem>
      ))}
    </ExerciseHistoryBlock>
  );
};

export default ExerciseHistory;
