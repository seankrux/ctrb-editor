import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import ClientThemeSync from './ClientThemeSync';

export const metadata: Metadata = {
  title: 'CTRBooster Nebula',
  description: 'CTRBooster campaign operations dashboard',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientThemeSync>{children}</ClientThemeSync>
      </body>
    </html>
  );
}
