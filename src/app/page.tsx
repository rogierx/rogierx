"use client";

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000;
  color: #0f0;
`;

export default function Home() {
  return (
    <Container>
      <h1>Trippy Art Generator</h1>
      {/* Pattern generation components will be added here */}
    </Container>
  );
}
