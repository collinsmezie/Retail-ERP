import './globals.css';
import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import '@fontsource/geist/700.css';
import type { ReactNode } from 'react';
import ClientProviders from '../components/ClientProviders';
import ThemeRegistry from '../theme/ThemeRegistry';

export const metadata = { title: 'Retail ERP', description: 'Modern ERP for Nigerian Retail' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        <ThemeRegistry>
          <ClientProviders>
            {children}
          </ClientProviders>
        </ThemeRegistry>
      </body>
    </html>
  );
}
