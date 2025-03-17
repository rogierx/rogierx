'use client';

import styled from 'styled-components';
import PatternGrid from '@/components/PatternGrid';

const Container = styled.div`
  min-height: 100vh;
  background: #000;
  color: #0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export default function Home() {
  return (
    <Container>
      <PatternGrid />
    </Container>
  );
}