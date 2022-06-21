import React from 'react';
import styled from '@emotion/styled';
import { Point, ResponsiveLine } from '@nivo/line';
import { ProgressItem } from 'modules/user';
import { useSelector } from 'react-redux';
import { userSelector } from 'modules/hooks';
import { getDatestr, getKorProgress } from 'lib/methods';
import AddProgress from './AddProgress';

const CustomTooltip = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  h4 {
    margin: 0 0 1rem 0;
  }
`;

const customSliceTooltip = ({
  slice: { points },
}: {
  slice: { points: Point[] };
}) => {
  return (
    <CustomTooltip>
      <h4>{points[0].data.x}</h4>
      {points.map((p) => (
        <span key={p.id}>
          {getKorProgress(p.id)}: {p.data.y}kg
        </span>
      ))}
    </CustomTooltip>
  );
};

const MyResponsiveLine = ({ data }: { data: ProgressItem[] }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
    }}
    curve="cardinal"
    axisTop={null}
    axisRight={null}
    axisBottom={null}
    enableSlices="x"
    enableCrosshair
    sliceTooltip={customSliceTooltip}
    lineWidth={4}
    colors={{ scheme: 'category10' }}
    pointSize={8}
    pointLabelYOffset={-12}
  />
);

const ProgressViewerBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 20rem;
`;

const ProgressViewer = () => {
  const user = useSelector(userSelector);
  const data: ProgressItem[] = user.progress.map((item) => ({
    ...item,
    data: item.data.slice(Math.max(0, item.data.length - 10), item.data.length),
  }));

  if (!data)
    return (
      <ProgressViewerBlock>
        <h3>기록이 없습니다.</h3>
      </ProgressViewerBlock>
    );

  if (!data[0].data.length)
    return (
      <ProgressViewerBlock>
        <h3>새 측정값을 추가하세요.</h3>
        <AddProgress />
      </ProgressViewerBlock>
    );

  return (
    <ProgressViewerBlock>
      <MyResponsiveLine data={data} />
      {!data[0].data.filter((d) => d.x === getDatestr(new Date())).length ? (
        <div>
          <h3>신규 측정값 추가</h3>
          <AddProgress />
        </div>
      ) : (
        <h3>이미 오늘 측정값을 추가했습니다.</h3>
      )}
    </ProgressViewerBlock>
  );
};

export default ProgressViewer;
