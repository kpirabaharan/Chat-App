import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

import './globals.css';

import { getSelf } from '@/lib/auth-service';
import { ThemeProvider } from '@/providers/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Chat app wtih Next.js and socket.io',
};

interface RootLayoutProps extends PropsWithChildren {}

const RootLayout = async ({ children }: RootLayoutProps) => {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          termsPageUrl: 'https://clerk.dev/terms',
          shimmer: true,
        },
        variables: {
          colorPrimary: '#000000',
        },
      }}
    >
      <html lang='en'>
        <body className={inter.className}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
