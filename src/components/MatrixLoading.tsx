'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
`;

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
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border: 1px solid #0f0;
  width: 600px;
  white-space: pre;
`;

const GlitchText = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  color: #00ff00;
  opacity: 0.3;
  font-family: monospace;
  font-size: 14px;
  white-space: pre;
  pointer-events: none;
`;

interface Props {
  text: string;
  progress: number;
  isLoading: boolean;
}

const createGlitchText = () => {
  const glitchChars = "█▓▒░█▓▒░";
  return Array(Math.floor(Math.random() * 20) + 10)
    .fill(0)
    .map(() => glitchChars[Math.floor(Math.random() * glitchChars.length)])
    .join("");
};

export default function MatrixLoading({ text, progress, isLoading }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glitches, setGlitches] = useState<Array<{ top: number; left: number; text: string }>>([]);

  useEffect(() => {
    if (!isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const chars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ01';

    ctx.font = `${fontSize}px monospace`;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    // Update glitch effects
    const glitchInterval = setInterval(() => {
      setGlitches(Array(3).fill(0).map(() => ({
        top: Math.random() * 60 + 20,
        left: Math.random() * 60 + 20,
        text: createGlitchText()
      })));
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, [isLoading]);

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
    <>
      <Canvas ref={canvasRef} />
      <LoadingContainer>
        {matrixText}
      </LoadingContainer>
      {glitches.map((glitch, i) => (
        <GlitchText key={i} top={glitch.top} left={glitch.left}>
          {glitch.text}
        </GlitchText>
      ))}
    </>
  );
}