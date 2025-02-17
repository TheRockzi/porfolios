import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CustomCursor } from '@/components/custom-cursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LKero | Creative Developer',
  description: 'Portfolio of LKero - Creative Developer and Digital Artist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}