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
  font-size: 16px;
  text-align: left;
  z-index: 101;
  text-shadow: 0 0 5px #0f0;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border: 1px solid #0f0;
  max-width: 600px;
  width: 100%;
  white-space: pre-wrap;
`;

interface Props {
  text: string;
  isLoading: boolean;
}

const matrixIntro = [
  "Wake up, Neo...",
  "The Matrix has you...",
  "Follow the white rabbit...",
  "Knock, knock, Neo...",
  "",
  "Initializing pattern generation system...",
  "[■■■■■■■■■■] 100%",
  "",
  "System Status:",
  "============",
  "GPU Acceleration: ENABLED",
  "Neural Network: ONLINE",
  "Pattern Engine: READY",
  "Memory Usage: OPTIMAL",
  "",
  "Generating patterns...",
  "Please stand by..."
];

export default function MatrixLoading({ text, isLoading }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setDisplayedText([]);
      setCurrentLine(0);
      setCurrentChar(0);
      return;
    }

    const typewriterInterval = setInterval(() => {
      if (currentLine >= matrixIntro.length) {
        clearInterval(typewriterInterval);
        return;
      }

      const currentText = matrixIntro[currentLine];
      if (currentChar >= currentText.length) {
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
        setDisplayedText(prev => [...prev, currentText]);
      } else {
        setCurrentChar(prev => prev + 1);
        setDisplayedText(prev => {
          const newText = [...prev];
          if (newText.length <= currentLine) {
            newText.push(currentText.substring(0, currentChar + 1));
          } else {
            newText[currentLine] = currentText.substring(0, currentChar + 1);
          }
          return newText;
        });
      }
    }, 50);

    return () => clearInterval(typewriterInterval);
  }, [isLoading, currentLine, currentChar]);

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
    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <>
      <Canvas ref={canvasRef} />
      <LoadingContainer>
        {displayedText.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {text && <div style={{ marginTop: '20px', color: '#0ff' }}>{text}</div>}
      </LoadingContainer>
    </>
  );
}