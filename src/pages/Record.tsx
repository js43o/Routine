import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Template from 'templates/Template';
import { userSelector } from 'modules/hooks';
import { CompleteItem } from 'types';
import { getDatestr, hideScroll, unhideScroll } from 'lib/methods';
import { FaPencilAlt } from 'react-icons/fa';
import RoutineExerciseList from 'components/Routine/ExerciseList';
import RecordCalendar from 'components/Record/RecordCalendar';
import ProgressViewer from 'components/Record/ProgressViewer';
import SetProgressModal from 'components/Record/ProgressModal';
import Button from 'components/common/Button';

const MemoBlock = styled.div`
  background: ${({ theme }) => theme.memo_body};
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  div {
    font-size: 1.5rem;
  }
`;

const RecordPage = () => {
  const { user } = useSelector(userSelector);

  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [records, setRecords] = useState<CompleteItem[]>([]);
  const [selected, setSelected] = useState<CompleteItem | null>(null);
  const [modal, setModal] = useState(false);
  const windowWidth = useRef(document.body.offsetWidth);

  const onOpenModal = useCallback(() => {
    windowWidth.current = document.body.offsetWidth;
    setModal(true);
    hideScroll();
  }, []);
  const onCloseModal = useCallback(() => {
    setModal(false);
    unhideScroll();
  }, []);

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

  const increaseMonth = useCallback(() => {
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
  }, [currentDate]);

  const decreaseMonth = useCallback(() => {
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
  }, [currentDate]);

  const setDateNow = useCallback(
    () =>
      setCurrentDate({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
      }),
    [],
  );

  const onSelect = useCallback(
    (e: React.MouseEvent) => {
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
      if (!info) return;
      setSelected(info);
    },
    [records, currentDate],
  );

  return (
    <Template>
      <SetProgressModal
        data={user.progress}
        visible={modal}
        offset={windowWidth.current}
        onCloseModal={onCloseModal}
      />
      <RecordCalendar
        date={currentDate}
        records={records}
        selectedDate={selected ? selected.date : null}
        onIncrease={increaseMonth}
        onDecrease={decreaseMonth}
        onDateNow={setDateNow}
        onSelect={onSelect}
      />
      {selected && selected.list.length > 0 ? (
        <>
          <span>
            {selected.date.slice(5, 7)}월 {selected.date.slice(8, 10)}일
          </span>
          <h2>수행한 운동</h2>
          <RoutineExerciseList dayRoutine={selected.list} />
          <h2>메모</h2>
          {selected.memo ? (
            <MemoBlock>{selected.memo}</MemoBlock>
          ) : (
            <p>작성한 메모가 없습니다.</p>
          )}
        </>
      ) : (
        <h3>수행한 운동이 없습니다.</h3>
      )}
      <hr />
      <ProgressHeader>
        <h1>체성분 변화</h1>
        <Button onClick={onOpenModal}>
          <FaPencilAlt />
        </Button>
      </ProgressHeader>
      <ProgressViewer data={user.progress} />
    </Template>
  );
};

export default RecordPage;
