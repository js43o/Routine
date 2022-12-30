import React, { ReactNode, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

const ModalWrapper = styled.div<{ visible: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.25s;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;

const ModalBlock = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  z-index: 100;
  width: 90%;
  max-width: 430px;
  height: 90%;
  border: 1px solid ${({ theme }) => theme.border_main};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  overflow: hidden;
`;

type ModalProps = {
  isVisible: boolean;
  children: ReactNode;
};

const Modal = ({ isVisible, children }: ModalProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (isVisible) ref.current.focus();
  }, [isVisible]);

  return (
    <ModalWrapper visible={isVisible}>
      <ModalBlock visible={isVisible} ref={ref} tabIndex={0}>
        {children}
      </ModalBlock>
    </ModalWrapper>
  );
};

export default Modal;
