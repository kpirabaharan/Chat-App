import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

import './globals.css';

import { ModalProvider } from '@/providers/modal-provider';
import { QueryProvider } from '@/providers/query-provider';
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
              <ModalProvider />
              <QueryProvider>
                <Toaster richColors theme={'light'} position='bottom-right' />
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
