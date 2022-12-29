import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { getDatestr, getWeekDate } from 'lib/methods';
import { CompleteItem } from 'types';
import CompleteList from './CompleteList';

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
  const [visible, setVisible] = useState<Date | null>(null);

  const weekDate = getWeekDate(new Date());

  const removeComplete = (e: MouseEvent) => {
    if (!e.target || !(e.target as HTMLElement).closest('.complete-item'))
      setVisible(null);
  };

  useEffect(() => {
    document.addEventListener('click', removeComplete);
    return () => document.removeEventListener('click', removeComplete);
  }, []);

  return (
    <CompleteDayBarBlock>
      {weekDate.map((date) => {
        const dayComplete = completes.filter(
          (complete) => complete.date === getDatestr(date),
        )[0];
        return (
          <CompleteDayItem
            done={!!dayComplete}
            key={date.getDay()}
            onClick={() => setVisible(date)}
            className="complete-item"
          >
            {date.getDate()}
            <CompleteList
              complete={dayComplete}
              visible={visible?.getDate() === date.getDate()}
            />
          </CompleteDayItem>
        );
      })}
    </CompleteDayBarBlock>
  );
};

export default CompleteDayBar;
