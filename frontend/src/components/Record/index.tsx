import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Template from 'templates/Template';
import { userSelector } from 'modules/hooks';
import { CompleteItem } from 'types';
import { hideScroll, unhideScroll } from 'lib/methods';
import { FaPencilAlt } from 'react-icons/fa';
import RecordCalendar from 'components/Record/RecordCalendar';
import ProgressViewer from 'components/Record/ProgressViewer';
import SetProgressModal from 'components/Record/ProgressModal';
import ExerciseHistory from 'components/Record/ExerciseHistory';
import Button from 'components/common/Button';

const RecordBlock = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    text-align: center;
  }
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
`;

const MemoBlock = styled.div`
  background: ${({ theme }) => theme.memo_body};
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  padding: 0.25rem;
`;

const AddProgressButton = styled(Button)`
  font-size: 1.5rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  align-self: center;
  font-size: 1.5rem;
  @media (min-width: 430px) {
    align-self: start;
  }
`;

const RecordPage = () => {
  const { user } = useSelector(userSelector);
  const [selected, setSelected] = useState<CompleteItem | null>(null);

  const [modal, setModal] = useState(false);

  const onOpenModal = useCallback(() => {
    setModal(true);
    hideScroll();
  }, []);

  const onCloseModal = useCallback(() => {
    setModal(false);
    setTimeout(unhideScroll, 500);
  }, []);

  return (
    <Template>
      <SetProgressModal
        visible={modal}
        data={user.progress}
        onCloseModal={onCloseModal}
      />
      <RecordCalendar
        selectedDate={selected ? selected.date : null}
        setSelected={setSelected}
      />
      <RecordBlock>
        <h3>
          {selected &&
            `${selected.date.slice(5, 7)}월 ${selected.date.slice(
              8,
              10,
            )}일 기록`}
        </h3>
        <ExerciseHistory complete={selected} />
        <MemoBlock>
          {(selected && selected.memo) || <i>작성한 메모가 없습니다.</i>}
        </MemoBlock>
      </RecordBlock>
      <ProgressHeader>
        <h1>체성분 변화</h1>
        <AddProgressButton onClick={onOpenModal} aria-label="add progress">
          <FaPencilAlt />
        </AddProgressButton>
      </ProgressHeader>
      <ProgressViewer data={user.progress} />
    </Template>
  );
};

export default RecordPage;
