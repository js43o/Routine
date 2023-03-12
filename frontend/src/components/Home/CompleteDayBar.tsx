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
  & > li {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const CompleteDayItem = styled.button<{ done?: boolean; idx: number }>`
  width: 100%;
  background: ${({ done, theme }) =>
    done ? theme.primary : theme.background_sub};
  border-radius: 0;
  font-weight: 500;
  color: ${({ theme, done, idx }) => {
    if (done) return theme.letter_primary;
    if (idx === 0) return theme.red;
    if (idx === 6) return theme.blue;
    return theme.letter_main;
  }};
`;

type CompleteBarProps = {
  completes: CompleteItem[];
};

const CompleteDayBar = ({ completes }: CompleteBarProps) => {
  const [visible, setVisible] = useState<Date | null>(null);

  const weekDate = getWeekDate(new Date());

  const hideComplete = (e: MouseEvent) => {
    if (
      !e.target ||
      !(e.target instanceof HTMLElement) ||
      !e.target.closest('.complete-item')
    )
      setVisible(null);
  };

  useEffect(() => {
    document.addEventListener('click', hideComplete);
    return () => document.removeEventListener('click', hideComplete);
  }, []);

  return (
    <CompleteDayBarBlock>
      {weekDate.map((date, idx) => {
        const dayComplete = completes.filter(
          (complete) => complete.date === getDatestr(date),
        )[0];
        return (
          <li>
            <CompleteDayItem
              done={!!dayComplete}
              key={date.getDay()}
              onClick={() => setVisible(date)}
              className="complete-item"
              idx={idx}
            >
              {date.getDate()}
            </CompleteDayItem>
            <CompleteList
              complete={dayComplete}
              visible={visible?.getDate() === date.getDate()}
            />
          </li>
        );
      })}
    </CompleteDayBarBlock>
  );
};

export default CompleteDayBar;
