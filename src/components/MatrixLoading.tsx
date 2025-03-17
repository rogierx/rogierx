'use client';

import styled from 'styled-components';

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  color: #0f0;
  font-family: monospace;
  font-size: 14px;
  text-align: left;
  white-space: pre;
`;

const TextContainer = styled.div`
  text-shadow: 0 0 5px #0f0;
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
      <TextContainer>
        {matrixText}
      </TextContainer>
    </LoadingContainer>
  );
}