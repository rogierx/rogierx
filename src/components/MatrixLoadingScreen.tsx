import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 2px) }
  40% { transform: translate(-2px, -2px) }
  60% { transform: translate(2px, 2px) }
  80% { transform: translate(2px, -2px) }
  100% { transform: translate(0) }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
  color: lime;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const Content = styled.pre`
  font-size: 12px;
  line-height: 1.4;
  animation: ${glitch} 0.5s infinite;
  text-shadow: 0 0 5px lime;
`;

const GlitchOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const GlitchLine = styled.div<{ top: string }>`
  position: absolute;
  top: ${props => props.top};
  left: 0;
  width: 100%;
  height: 1px;
  background: rgba(0, 255, 0, 0.3);
  animation: ${glitch} 1s infinite;
`;

interface Props {
  progress: number;
}

export const MatrixLoadingScreen: React.FC<Props> = ({ progress }) => {
  const [glitchLines, setGlitchLines] = useState<string[]>([]);
  
  useEffect(() => {
    const lines = Array.from({ length: 10 }, () => 
      `${Math.random() * 100}%`
    );
    setGlitchLines(lines);
  }, []);

  const progressBar = "[" + "■".repeat(Math.floor(progress / 10)) + "□".repeat(10 - Math.floor(progress / 10)) + "]";

  return (
    <Container>
      <Content>
        {`
=====================================
>>> NEURAL ART SYNTHESIS MATRIX v2.1
>>> QUANTUM PATTERN GENERATOR
=====================================

> System Status: ONLINE
> Neural Cores: ACTIVE
> Pattern Engine: INITIALIZED
> Quantum State: COHERENT

> Operation: Synthesizing patterns...
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
=====================================
        `}
      </Content>
      <GlitchOverlay>
        {glitchLines.map((top, i) => (
          <GlitchLine key={i} top={top} />
        ))}
      </GlitchOverlay>
    </Container>
  );
};