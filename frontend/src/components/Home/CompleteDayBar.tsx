import React from 'react';
import styled from '@emotion/styled';
import { getDatestr, getWeekDate } from 'lib/methods';
import { CompleteItem } from 'types';

const CompleteDayBarBlock = styled.ul`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const CompleteDayItem = styled.li<{ done?: boolean }>`
  display: flex;
  justify-content: center;
  background: ${({ done, theme }) =>
    done ? theme.primary : theme.background_sub};
  color: ${({ theme, done }) => done && theme.letter_primary};
  font-weight: bold;
  &:nth-of-type(1) {
    color: ${({ theme, done }) => (done ? theme.letter_primary : theme.red)};
  }
  &:nth-of-type(7) {
    color: ${({ theme, done }) => (done ? theme.letter_primary : theme.blue)};
  }
`;

type CompleteBarProps = {
  completes: CompleteItem[];
};

const CompleteDayBar = ({ completes }: CompleteBarProps) => {
  const weekDate = getWeekDate(new Date());

  return (
    <CompleteDayBarBlock>
      {weekDate.map((w) =>
        completes.filter((c) => c.date === getDatestr(w)).length ? (
          <CompleteDayItem done key={w.getDay()}>
            {w.getDate()}
          </CompleteDayItem>
        ) : (
          <CompleteDayItem key={w.getDay()}>{w.getDate()}</CompleteDayItem>
        ),
      )}
    </CompleteDayBarBlock>
  );
};

export default CompleteDayBar;
