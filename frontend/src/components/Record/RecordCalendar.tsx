import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { FaRegCalendarCheck } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs';
import { userSelector } from 'modules/hooks';
import { CompleteItem } from 'types';
import {
  getCalendarDateWithRecords,
  getDatestr,
  getFirstDayIdx,
  getLastDateOfLastMonth,
} from 'lib/methods';
import { DAY_KOR_NAME_LIST, DUMMY_DAYS } from 'lib/constants';
import Button from 'components/common/Button';
import CalendarItem from './CalendarItem';

const RecordCalendarBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const CalendarList = styled.ul`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  place-items: center;
  width: 100%;
  padding: 1rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  .day-name:nth-of-type(1) {
    color: ${({ theme }) => theme.red};
  }
  .day-name:nth-of-type(7) {
    color: ${({ theme }) => theme.blue};
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
    }
  }
  form {
    display: flex;
    font-size: 2rem;
    .year {
      width: 4.25rem;
    }
    .month {
      width: 2.5rem;
    }
    button {
      font-size: 1.5rem;
      margin-left: 0.5rem;
    }
  }
`;

const DateIndicator = styled(Button)`
  font-weight: 500;
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
  const [input, setInput] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });

  const [records, setRecords] = useState<CompleteItem[]>([]);
  const [dummyDays, setDummyDays] = useState<[number[], number[]]>([[], []]);

  const handleChangeDateField = (
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

  const selectDay = (day: number) => {
    const info = records.find(
      (r) =>
        r.date ===
        getDatestr(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
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
    const calculated = getCalendarDateWithRecords(currentDate, user.completes);

    setDummyDays([calculated.frontDummy, calculated.rearDummy]);
    setRecords(calculated.records);
    setInput({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    });
  }, [currentDate, user.completes]);

  return (
    <RecordCalendarBlock>
      <CalendarHeader>
        <ArrowButton onClick={decreaseMonth} aria-label="prev month">
          <MdNavigateBefore />
        </ArrowButton>
        {edit ? (
          <form onSubmit={onSubmit}>
            <input
              title="year"
              className="year count"
              type="number"
              value={input.year.toString()}
              onChange={(e) => handleChangeDateField(e, 'year')}
              min={2000}
              max={2999}
              placeholder="연도"
            />
            -
            <input
              title="month"
              className="month count"
              type="number"
              value={input.month.toString()}
              onChange={(e) => handleChangeDateField(e, 'month')}
              min={1}
              max={12}
              placeholder="월"
            />
            <CheckButton type="submit" aria-label="set date">
              <BsCheckLg />
            </CheckButton>
          </form>
        ) : (
          <div className="title">
            <DateIndicator onClick={() => setEdit(true)}>
              {currentDate.getFullYear()}-
              {currentDate.getMonth() < 9
                ? `0${currentDate.getMonth() + 1}`
                : currentDate.getMonth() + 1}
            </DateIndicator>
            <Button onClick={setDateNow} aria-label="today">
              <FaRegCalendarCheck />
            </Button>
          </div>
        )}
        <ArrowButton onClick={increaseMonth} aria-label="next month">
          <MdNavigateNext />
        </ArrowButton>
      </CalendarHeader>
      <CalendarList>
        {DAY_KOR_NAME_LIST.map((dayName) => (
          <li className="day-name" key={dayName}>
            {dayName}
          </li>
        ))}
        {records.length > 0 ? (
          <>
            {dummyDays[0].map((_, idx) => (
              <CalendarItem
                key={idx}
                wire
                day={
                  getLastDateOfLastMonth(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                  ) +
                  (idx + 1 - getFirstDayIdx(currentDate))
                }
                handleClick={decreaseMonth}
              />
            ))}
            {records.map((d) => (
              <CalendarItem
                key={d.date}
                day={Number(d.date.slice(8, 10))}
                performed={d.exerciseList.length > 0}
                selected={selectedDate === d.date}
                handleClick={() => selectDay(Number(d.date.slice(8, 10)))}
              />
            ))}
            {dummyDays[1].map((_, idx) => (
              <CalendarItem
                key={idx}
                wire
                day={idx + 1}
                performed={false}
                selected={false}
                handleClick={increaseMonth}
              />
            ))}
          </>
        ) : (
          <>
            {DUMMY_DAYS.map((day) => (
              <CalendarItem key={day} wire day={day} />
            ))}
          </>
        )}
      </CalendarList>
    </RecordCalendarBlock>
  );
};

export default React.memo(RecordCalendar);
