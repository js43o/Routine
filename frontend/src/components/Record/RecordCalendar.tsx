import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { CompleteItem } from 'types';
import Button from 'components/common/Button';
import {
  dayidxToDaystr,
  getDatestr,
  getFirstDay,
  getLastDayOfLastMonth,
} from 'lib/methods';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { FaRegCalendarCheck } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { userSelector } from 'modules/hooks';

const RecordCalendarBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
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
  span {
    font-weight: bold;
  }
  span:nth-of-type(1) {
    color: ${({ theme }) => theme.red};
  }
  span:nth-of-type(7) {
    color: ${({ theme }) => theme.blue};
  }
`;

const CalendarItemWire = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  opacity: 0.25;
  &:nth-of-type(7n + 1) {
    color: ${({ theme }) => theme.red};
  }
  &:nth-of-type(7n) {
    color: ${({ theme }) => theme.blue};
  }
  @media (min-width: 430px) {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }
`;

const CalendarItem = styled(CalendarItemWire)<{
  selected: boolean;
  performed: boolean;
}>`
  border: ${({ selected, performed, theme }) =>
    `2px solid ${selected || (performed && theme.primary)}`};
  border-radius: 25%;
  color: ${({ selected, theme }) => selected && theme.letter_primary};
  background: ${({ selected, theme }) => (selected ? theme.primary : '')};
  opacity: 1;
  cursor: pointer;
  &:nth-of-type(7n + 1) {
    color: ${({ selected, theme }) =>
      selected ? theme.letter_primary : theme.red};
  }
  &:nth-of-type(7n) {
    color: ${({ selected, theme }) =>
      selected ? theme.letter_primary : theme.blue};
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
  form {
    display: flex;
    font-size: 2rem;
    .year {
      width: 4.75rem;
    }
    .month {
      width: 3rem;
    }
    button {
      font-size: 1.5rem;
      margin-left: 0.5rem;
    }
  }
`;

const DateIndicator = styled(Button)`
  font-size: 2rem;
`;

const ArrowButton = styled(Button)`
  font-size: 2.5rem;
`;

const CheckButton = styled(Button)`
  color: ${({ theme }) => theme.primary};
`;

type RecordCalendarProps = {
  selectedDate: string | null;
  setSelected: React.Dispatch<React.SetStateAction<CompleteItem | null>>;
};

const RecordCalendar = ({ selectedDate, setSelected }: RecordCalendarProps) => {
  const { user } = useSelector(userSelector);
  const [edit, setEdit] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<CompleteItem[]>([]);
  const [input, setInput] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'year' | 'month',
  ) => {
    e.preventDefault();
    const text = e.target.value;
    if (
      (field === 'year' && text.length > 4) ||
      (field === 'month' && text.length > 2)
    )
      return;

    if (text.length > 1 && text[0] === '0') {
      setInput({
        ...input,
        [field]: +text.slice(1),
      });
    } else {
      setInput({
        ...input,
        [field]: +text,
      });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentDate(new Date(input.year, input.month - 1));
    setEdit(false);
  };

  const increaseMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );

  const decreaseMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );

  const onSelect = (e: React.MouseEvent) => {
    const elem = (e.target as HTMLLIElement).closest('li');
    if (!elem || !elem.textContent) return;

    const info = records.find(
      (r) =>
        r.date ===
        getDatestr(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            +(elem.textContent as string),
          ),
        ),
    );

    if (info) setSelected(info);
  };

  const setDateNow = () => {
    setCurrentDate(new Date());
    const info = records.find((r) => r.date === getDatestr(new Date()));
    if (info) setSelected(info);
  };

  useEffect(() => {
    const firstDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const tempRecords: CompleteItem[] = [];

    while (firstDate.getMonth() === currentDate.getMonth()) {
      const r = user.completes.find((c) => c.date === getDatestr(firstDate));
      tempRecords.push({
        date: getDatestr(firstDate),
        list: r ? r.list : [],
        memo: r ? r.memo : '',
      });
      firstDate.setDate(firstDate.getDate() + 1);
    }
    setRecords(tempRecords);
    setInput({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    });
  }, [currentDate, user.completes]);

  return (
    <RecordCalendarBlock>
      <CalendarHeader>
        <Button onClick={decreaseMonth}>
          <ArrowButton>
            <MdNavigateBefore />
          </ArrowButton>
        </Button>
        {edit ? (
          <form onSubmit={onSubmit}>
            <input
              className="year count"
              type="number"
              value={`${input.year}`}
              onChange={(e) => onChange(e, 'year')}
              min={1900}
              max={9999}
            />
            .
            <input
              className="month count"
              type="number"
              value={`${input.month}`}
              onChange={(e) => onChange(e, 'month')}
              min={1}
              max={12}
            />
            <CheckButton type="submit">
              <BsCheckLg />
            </CheckButton>
          </form>
        ) : (
          <div className="title">
            <DateIndicator onClick={() => setEdit(true)}>
              {currentDate.getFullYear()}.
              {currentDate.getMonth() < 9
                ? `0${currentDate.getMonth() + 1}`
                : currentDate.getMonth() + 1}
            </DateIndicator>
            <Button onClick={setDateNow}>
              <FaRegCalendarCheck />
            </Button>
          </div>
        )}
        <ArrowButton onClick={increaseMonth}>
          <MdNavigateNext />
        </ArrowButton>
      </CalendarHeader>
      <CalendarList>
        {[...Array(7)].map((_, i) => (
          <span>{dayidxToDaystr(i)}</span>
        ))}
        {[...Array(getFirstDay(currentDate))].map((_, i) => (
          <CalendarItemWire onClick={() => decreaseMonth()}>
            {getLastDayOfLastMonth(
              currentDate.getFullYear(),
              currentDate.getMonth(),
            ) +
              (i + 1 - getFirstDay(currentDate))}
          </CalendarItemWire>
        ))}
        {records.length &&
          records.map((d) => (
            <CalendarItem
              key={d.date}
              performed={d.list.length > 0}
              selected={selectedDate === d.date}
              onClick={(e) => onSelect(e)}
            >
              {+d.date.slice(8, 10) > 0 && +d.date.slice(8, 10)}
            </CalendarItem>
          ))}
        {[
          ...Array(
            getFirstDay(currentDate) + records.length <= 35
              ? Math.max(35 - (getFirstDay(currentDate) + records.length), 0)
              : Math.max(42 - (getFirstDay(currentDate) + records.length), 0),
          ),
        ].map((_, i) => (
          <CalendarItemWire onClick={increaseMonth}>{i + 1}</CalendarItemWire>
        ))}
      </CalendarList>
    </RecordCalendarBlock>
  );
};

export default React.memo(RecordCalendar);
