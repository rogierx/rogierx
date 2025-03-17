'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #0f0;
  font-family: monospace;
  font-size: 14px;
  text-align: left;
  z-index: 101;
  text-shadow: 0 0 5px #0f0;
  background: #000;
  padding: 20px;
  white-space: pre;
`;

interface Props {
  text: string;
  progress: number;
  isLoading: boolean;
}

export default function MatrixLoading({ text, progress, isLoading }: Props) {
  if (!isLoading) return null;

  const progressBar = "[" + "■".repeat(Math.floor(progress / 10)) + "□".repeat(10 - Math.floor(progress / 10)) + "]";

  const matrixText = `
=====================================
>>> NEURAL ART SYNTHESIS MATRIX v2.1
>>> QUANTUM PATTERN GENERATOR
=====================================

> System Status: ONLINE
> Neural Cores: ACTIVE
> Pattern Engine: INITIALIZED
> Quantum State: COHERENT

> Operation: ${text}
> Resolution: 4K (3840x2160)
> Memory Buffer: ALLOCATED
> Pattern Matrix: STABILIZED

${progressBar} ${progress.toFixed(1)}%

> Subprocess: Pattern Synthesis
> Fractal Dimension: OPTIMAL
> Entropy Level: BALANCED
> Reality Distortion: ENABLED

> Pattern Type: CALCULATING...
> Color Matrix: PROCESSING...
> Neural Weights: OPTIMIZING...
> Quantum Fluctuations: STABLE

[SYSTEM READY FOR NEXT OPERATION]
=====================================`;

  return (
    <LoadingContainer>
      {matrixText}
    </LoadingContainer>
  );
}