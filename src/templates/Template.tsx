import React from 'react';
import styled from '@emotion/styled';
import Header from './Header';
import Footer from './Footer';

const TemplateBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  @media (min-width: 768px) {
    width: 768px;
  }
`;

const ContentBlock = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background_main};
  padding: 1rem;
  border-radius: 0.5rem;
  flex-grow: 1;
`;

type TemplateProps = {
  children: React.ReactNode;
};

const Template = ({ children }: TemplateProps) => {
  return (
    <TemplateBlock>
      <Header />
      <ContentBlock>{children}</ContentBlock>
      <Footer />
    </TemplateBlock>
  );
};

export default Template;
