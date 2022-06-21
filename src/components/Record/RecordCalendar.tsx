import React from 'react';
import styled from '@emotion/styled';
import { CompleteItem } from 'modules/user';
import Button from 'components/common/Button';
import { dayidxToDaystr } from 'lib/methods';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { FaRegCalendarCheck } from 'react-icons/fa';

const RecordCalendarBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const CalendarList = styled.ul`
  display: grid;
  place-items: center;
  row-gap: 1rem;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  padding: 1rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  @media (min-width: 430px) {
    padding: 2rem 0.5rem;
  }
  span:nth-of-type(1) {
    color: ${({ theme }) => theme.red};
  }
  span:nth-of-type(7) {
    color: ${({ theme }) => theme.blue};
  }
`;

const CalendarItem = styled.li<{ selected: boolean; performed: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border: ${({ performed, theme }) =>
    performed ? `2px solid ${theme.primary}` : ''};
  border-radius: 50%;
  background: ${({ selected, theme }) => (selected ? theme.primary : '')};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  &:nth-of-type(7n + 1) {
    color: ${({ theme }) => theme.red};
  }
  &:nth-of-type(7n) {
    color: ${({ theme }) => theme.blue};
  }
  @media (min-width: 430px) {
    font-size: 1.25rem;
    width: 3rem;
    height: 3rem;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .title {
    display: flex;
    gap: 0.5rem;
    svg {
      font-size: 1.5rem;
      transform: translateY(10%);
    }
  }
`;

const PrevButton = styled(MdNavigateBefore)`
  font-size: 2.5rem;
  border-radius: 50%;
  @media (hover: hover) {
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
`;

const NextButton = styled(MdNavigateNext)`
  font-size: 2.5rem;
  border-radius: 50%;
  @media (hover: hover) {
    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
`;

type RecordCalendarProps = {
  date: {
    year: number;
    month: number;
  };
  records: CompleteItem[];
  selectedDate: string | null;
  onIncrease: () => void;
  onDecrease: () => void;
  onDateNow: () => void;
  onSelect: (e: React.MouseEvent) => void;
};

const RecordCalendar = ({
  date,
  records,
  selectedDate,
  onIncrease,
  onDecrease,
  onDateNow,
  onSelect,
}: RecordCalendarProps) => {
  return (
    <RecordCalendarBlock>
      <CalendarHeader>
        <Button onClick={onDecrease}>
          <PrevButton />
        </Button>
        <div className="title">
          <h1>
            {date.year}.{date.month < 9 ? `0${date.month + 1}` : date.month + 1}
          </h1>
          <Button onClick={onDateNow}>
            <FaRegCalendarCheck />
          </Button>
        </div>
        <Button onClick={onIncrease}>
          <NextButton />
        </Button>
      </CalendarHeader>
      <CalendarList>
        {[...Array(7)].map((x, i) => (
          <span>{dayidxToDaystr(i)}</span>
        ))}
        {records.length > 0
          ? records.map((d) => (
              <CalendarItem
                key={d.date}
                performed={d.list.length > 0}
                selected={selectedDate === d.date}
                onClick={(e) => onSelect(e)}
              >
                {+d.date.slice(8, 10) > 0 && +d.date.slice(8, 10)}
              </CalendarItem>
            ))
          : [...Array(30)].map(() => (
              <CalendarItem selected={false} performed={false}></CalendarItem>
            ))}
      </CalendarList>
    </RecordCalendarBlock>
  );
};

export default React.memo(RecordCalendar);
