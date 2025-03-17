import React from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0% { box-shadow: 0 0 5px #0f0; }
  50% { box-shadow: 0 0 20px #0f0; }
  100% { box-shadow: 0 0 5px #0f0; }
`;

const ButtonContainer = styled.button`
  background: transparent;
  border: 1px solid #0f0;
  color: lime;
  font-family: monospace;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    animation: ${glow} 1.5s infinite;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #0f0);
    animation: ${keyframes`
      0% { left: -100% }
      50% { left: 100% }
      100% { left: 100% }
    `} 2s linear infinite;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #0f0);
    animation: ${keyframes`
      0% { right: -100% }
      50% { right: 100% }
      100% { right: 100% }
    `} 2s linear infinite;
    animation-delay: 1s;
  }
`;

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

export const MatrixButton: React.FC<Props> = ({ children, onClick }) => {
  return (
    <ButtonContainer onClick={onClick}>
      {children}
    </ButtonContainer>
  );
};