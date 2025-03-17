import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/registry';

export const metadata: Metadata = {
  title: 'Trippy Art Generator',
  description: 'Generate unique trippy art patterns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
