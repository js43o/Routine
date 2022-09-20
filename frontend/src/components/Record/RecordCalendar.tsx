import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { CompleteItem } from 'types';
import Button from 'components/common/Button';
import { dayidxToDaystr, getDatestr } from 'lib/methods';
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
  border: ${({ selected, performed, theme }) =>
    `2px solid ${selected || (performed && theme.primary)}`};
  border-radius: 1rem;
  color: ${({ selected, theme }) => selected && theme.letter_primary};
  background: ${({ selected, theme }) => (selected ? theme.primary : '')};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  &:nth-of-type(7n + 1) {
    color: ${({ selected, theme }) =>
      selected ? theme.letter_primary : theme.red};
  }
  &:nth-of-type(7n) {
    color: ${({ selected, theme }) =>
      selected ? theme.letter_primary : theme.blue};
  }
  @media (min-width: 430px) {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
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
    input {
      font-size: 1.5rem;
      &.year {
        width: 5.25rem;
      }
      &.month {
        width: 3.5rem;
      }
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
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [records, setRecords] = useState<CompleteItem[]>([]);

  const [input, setInput] = useState({
    year: currentDate.year,
    month: currentDate.month + 1,
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
    setCurrentDate({ year: input.year, month: input.month - 1 });
    setEdit(false);
  };

  const increaseMonth = () => {
    if (currentDate.month >= 11) {
      setCurrentDate({
        year: currentDate.year + 1,
        month: 0,
      });
    } else
      setCurrentDate({
        ...currentDate,
        month: currentDate.month + 1,
      });
  };

  const decreaseMonth = () => {
    if (currentDate.month <= 0) {
      setCurrentDate({
        year: currentDate.year - 1,
        month: 11,
      });
    } else
      setCurrentDate({
        ...currentDate,
        month: currentDate.month - 1,
      });
  };

  const onSelect = (e: React.MouseEvent) => {
    const elem = (e.target as HTMLLIElement).closest('li');
    if (!elem || !elem.textContent) return;

    const info = records.find(
      (r) =>
        r.date ===
        getDatestr(
          new Date(
            currentDate.year,
            currentDate.month,
            +(elem.textContent as string),
          ),
        ),
    );
    if (info) setSelected(info);
  };

  const setDateNow = () => {
    setCurrentDate({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    });
    const info = records.find((r) => r.date === getDatestr(new Date()));
    if (info) setSelected(info);
  };

  useEffect(() => {
    const firstDate = new Date(currentDate.year, currentDate.month);
    const tempRecords: CompleteItem[] = [];
    firstDate.setDate(1);

    for (let i = 0; i < 7; i += 1)
      if (i < firstDate.getDay())
        tempRecords.push({
          date: `${-i}`,
          list: [],
          memo: '',
        });

    while (firstDate.getMonth() === currentDate.month) {
      const r = user.completes.find((c) => c.date === getDatestr(firstDate));
      tempRecords.push({
        date: getDatestr(firstDate),
        list: r ? r.list : [],
        memo: r ? r.memo : '',
      });
      firstDate.setDate(firstDate.getDate() + 1);
    }
    setRecords(tempRecords);
  }, [currentDate, user.completes]);

  useEffect(() => {
    setInput({
      year: currentDate.year,
      month: currentDate.month + 1,
    });
  }, [currentDate]);

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
              className="year"
              type="number"
              value={`${input.year}`}
              onChange={(e) => onChange(e, 'year')}
              min={1900}
              max={9999}
            />
            .
            <input
              className="month"
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
              {currentDate.year}.
              {currentDate.month < 9
                ? `0${currentDate.month + 1}`
                : currentDate.month + 1}
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
      </CalendarList>
    </RecordCalendarBlock>
  );
};

export default React.memo(RecordCalendar);
