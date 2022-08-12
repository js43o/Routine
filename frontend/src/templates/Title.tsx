import React from 'react';
import styled from '@emotion/styled';
import { MdRefresh } from 'react-icons/md';

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  font-family: 'PT Sans Narrow', sans-serif;
  font-size: 2.5rem;
`;

const Title = () => {
  return (
    <TitleBlock>
      Routine
      <MdRefresh />
    </TitleBlock>
  );
};

export default Title;
