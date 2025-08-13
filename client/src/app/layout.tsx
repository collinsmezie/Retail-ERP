import './globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import ClientProviders from '../components/ClientProviders';
import ThemeRegistry from '../theme/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata = { title: 'Retail ERP', description: 'Modern ERP for Nigerian Retail' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <ThemeRegistry>
          <ClientProviders>
            {children}
          </ClientProviders>
        </ThemeRegistry>
      </body>
    </html>
  );
}
