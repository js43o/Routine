import React from 'react';
import styled from '@emotion/styled';
import { CgInfinity } from 'react-icons/cg';

const TitleBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'PT Sans Narrow', sans-serif;
  font-size: 2.5rem;
`;

const Title = () => {
  return (
    <TitleBlock>
      Routine
      <CgInfinity />
    </TitleBlock>
  );
};

export default Title;
