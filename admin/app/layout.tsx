import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AralAdventure Admin',
  description: 'Teacher dashboard for AralAdventure progress',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'monospace' }}>{children}</body>
    </html>
  );
}
