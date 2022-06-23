import React from 'react';
import styled from '@emotion/styled';
import { Point, ResponsiveLine } from '@nivo/line';
import { ProgressItem } from 'modules/user';
import { getKorProgress } from 'lib/methods';

const CustomTooltip = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
`;

const customSliceTooltip = ({
  slice: { points },
}: {
  slice: { points: Point[] };
}) => {
  return (
    <CustomTooltip>
      <b>{points[0].data.x}</b>
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

type ProgressViewerProps = {
  data: ProgressItem[];
};

const ProgressViewer = ({ data }: ProgressViewerProps) => {
  return (
    <ProgressViewerBlock>
      {!data || !data[0].data.length ? (
        <p>
          기록이 없습니다.
          <br />새 측정값을 추가하세요.
        </p>
      ) : (
        <MyResponsiveLine data={data} />
      )}
    </ProgressViewerBlock>
  );
};

export default ProgressViewer;
