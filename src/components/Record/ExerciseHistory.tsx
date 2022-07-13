import React from 'react';
import styled from '@emotion/styled';
import { ExerciseItem } from 'types';

const ExerciseHistoryBlock = styled.ul`
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_sub};
`;

const ExerciseHistoryItem = styled.li`
  display: flex;
  flex-direction: column;
  place-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  text-align: center;
`;

type ExerciseHistoryProps = {
  exercises: ExerciseItem[];
};

const ExerciseHistory = ({ exercises }: ExerciseHistoryProps) => {
  return (
    <ExerciseHistoryBlock>
      {exercises.map((exer) => (
        <ExerciseHistoryItem>
          <b>{exer.exercise}</b>
          <small>
            {exer.weight}kg, {exer.numberOfTimes}x{exer.numberOfSets}
          </small>
        </ExerciseHistoryItem>
      ))}
    </ExerciseHistoryBlock>
  );
};

export default ExerciseHistory;
