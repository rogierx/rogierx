'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MatrixLoading from './MatrixLoading';

// ... (keep all the styled components and interfaces the same)

export default function PatternGrid() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);

  // ... (keep all the pattern generation functions the same)

  const generatePattern = async (type: Pattern['type']) => {
    const canvas = document.createElement('canvas');
    canvas.width = 3840;  // 4K resolution
    canvas.height = 2160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    switch (type) {
      case 'noise':
        generateNoise(ctx, canvas.width, canvas.height);
        break;
      case 'geometric':
        generateGeometric(ctx, canvas.width, canvas.height);
        break;
      case 'mathematical':
        generateMathematical(ctx, canvas.width, canvas.height);
        break;
      case 'fractal':
        generateFractal(ctx, canvas.width, canvas.height);
        break;
    }

    return { type, canvas };
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generatePatterns = async () => {
    setLoading(true);
    setProgress(0);
    const types: Pattern['type'][] = ['noise', 'geometric', 'mathematical', 'fractal'];
    const newPatterns: Pattern[] = [];

    let currentProgress = 0;
    const updateProgressWithText = async (text: string, targetProgress: number) => {
      const steps = targetProgress - currentProgress;
      for (let i = 0; i < steps; i++) {
        currentProgress++;
        setProgress(currentProgress);
        setLoadingText(text);
        await sleep(20); // 20ms delay for smooth progress
      }
    };

    try {
      for (let i = 0; i < 4; i++) {
        const baseProgress = i * 25;
        const pattern = generatePattern(types[i]);
        
        // Update progress while "generating" the pattern
        for (let step = 1; step <= 25; step++) {
          await updateProgressWithText(
            `Synthesizing pattern ${i + 1}/4...\nProcessing quantum state ${step}/25`,
            baseProgress + step
          );
        }

        const result = await pattern;
        if (result) newPatterns.push(result);
      }

      // Ensure we reach 100%
      await updateProgressWithText('Pattern synthesis complete. Matrix stabilized.', 100);
      await sleep(500); // Show 100% briefly
      
      setPatterns(newPatterns);
    } finally {
      setLoading(false);
    }
  };

  const savePattern = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    link.download = `trippy_art_4k_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const saveAllPatterns = () => {
    patterns.forEach((pattern, index) => {
      setTimeout(() => savePattern(pattern.canvas), index * 500);
    });
  };

  useEffect(() => {
    generatePatterns();
  }, []);

  if (loading) {
    return (
      <MatrixLoading
        text={loadingText}
        progress={progress}
        isLoading={loading}
      />
    );
  }

  return (
    <Container>
      <PatternContainer>
        {patterns.map((pattern, index) => (
          <CanvasWrapper key={index} onClick={() => savePattern(pattern.canvas)}>
            <Canvas
              ref={canvas => {
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(pattern.canvas, 0, 0, canvas.width, canvas.height);
                  }
                }
              }}
            />
          </CanvasWrapper>
        ))}
      </PatternContainer>
      <Controls>
        <Button onClick={generatePatterns}>GENERATE</Button>
        <Button onClick={saveAllPatterns}>SAVE ALL</Button>
      </Controls>
    </Container>
  );
}