'use client';

import styled from 'styled-components';
import PatternGrid from '@/components/PatternGrid';
import MatrixLoading from '@/components/MatrixLoading';

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
  return (
    <Container>
      <Title>Trippy Art Generator</Title>
      <PatternGrid />
    </Container>
  );
}