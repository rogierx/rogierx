import type { Metadata } from 'next'
import StyledComponentsRegistry from '@/lib/registry'

export const metadata: Metadata = {
  title: 'Trippy Art Generator',
  description: 'Generate trippy art patterns with matrix-style interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: 'black' }}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}