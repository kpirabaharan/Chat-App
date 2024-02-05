import { PropsWithChildren } from 'react';

import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';

interface MessagesLayoutProps extends PropsWithChildren {}

export const revalidate = 0;

const MessagesLayout = async ({ children }: MessagesLayoutProps) => {
  return (
    <>
      <Navbar />
      <div className='flex h-full pt-16'>
        <Sidebar />
        <div className='h-full w-full pl-48'>{children}</div>
      </div>
    </>
  );
};

export default MessagesLayout;
