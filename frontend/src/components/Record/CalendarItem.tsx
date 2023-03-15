import React from 'react';
import styled from '@emotion/styled';
import { BsCheckLg } from 'react-icons/bs';

const CheckIcon = styled(BsCheckLg)<{ selected: boolean }>`
  color: ${({ theme, selected }) =>
    selected ? theme.letter_primary : theme.primary};
`;

const CalendarItemBlock = styled.li<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  overflow: hidden;
  @media (min-width: 430px) {
    width: 100%;
    height: 10vw;
    max-height: 5rem;
    border-right: 1px solid ${({ theme }) => theme.border_main};
    border-bottom: 1px solid ${({ theme }) => theme.border_main};
    border-radius: 0.5rem;
  }
  &:nth-of-type(7n + 1) button {
    color: ${({ theme, selected }) =>
      selected ? theme.letter_primary : theme.red};
  }
  &:nth-of-type(7n) button {
    color: ${({ theme, selected }) =>
      selected ? theme.letter_primary : theme.blue};
  }
`;

const DayButtonWire = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0.5;
  border-radius: 50%;
  opacity: 0.25;
  .day-text {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .check-icon {
    display: none;
    pointer-events: none;
  }
  @media (min-width: 430px) {
    align-items: flex-start;
    border-radius: 0;
    .day-text {
      justify-content: flex-end;
      align-items: flex-end;
    }
    .check-icon {
      display: flex;
    }
  }
`;

const DayButton = styled(DayButtonWire)<{
  selected: boolean;
  performed: boolean;
}>`
  border: ${({ theme, performed }) =>
    performed ? `1px solid ${theme.primary}` : 'none'};
  color: ${({ selected, theme }) => selected && theme.letter_primary};
  background: ${({ selected, theme }) =>
    selected ? theme.primary : 'inherit'};
  opacity: 1;
  transition: background 0.2s;
  cursor: pointer;
  @media (min-width: 430px) {
    border: none;
  }
`;

type CalendarItemType = {
  day: number;
  wire?: boolean;
  performed?: boolean;
  selected?: boolean;
  handleClick: () => void;
};

export default function CalendarItem({
  day,
  wire,
  performed,
  selected,
  handleClick,
}: CalendarItemType) {
  return (
    <CalendarItemBlock selected={!!selected}>
      {wire ? (
        <DayButtonWire onClick={handleClick}>
          <div className="day-text">{day}</div>
        </DayButtonWire>
      ) : (
        <DayButton
          selected={!!selected}
          performed={!!performed}
          onClick={handleClick}
        >
          <div className="check-icon">
            {performed ? <CheckIcon selected={!!selected} /> : ''}
          </div>
          <div className="day-text">{day}</div>
        </DayButton>
      )}
    </CalendarItemBlock>
  );
}

CalendarItem.defaultProps = {
  wire: false,
  performed: false,
  selected: false,
};
