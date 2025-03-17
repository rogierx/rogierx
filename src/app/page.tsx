"use client";

import styled from 'styled-components';
import PatternGrid from '@/components/PatternGrid';
import MatrixLoading from '@/components/MatrixLoading';
import { useState } from 'react';

const Container = styled.div`
  min-height: 100vh;
  background: #000;
  color: #0f0;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  font-family: monospace;
  font-size: 36px;
  margin-bottom: 40px;
  text-shadow: 0 0 10px #0f0;
`;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing...');

  return (
    <Container>
      <Title>Trippy Art Generator</Title>
      <PatternGrid />
      <MatrixLoading isLoading={isLoading} text={loadingText} />
    </Container>
  );
}
