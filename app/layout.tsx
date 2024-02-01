import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

import './globals.css';

import { getSelf } from '@/lib/auth-service';
import { SocketProvider } from '@/providers/socket-provider';
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
      <html lang='en' suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <SocketProvider>
              <Toaster richColors theme={'light'} position='bottom-right' />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
