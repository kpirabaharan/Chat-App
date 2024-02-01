import { PropsWithChildren } from 'react';

import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';

interface MessagesLayoutProps extends PropsWithChildren {}

const MessagesLayout = async ({ children }: MessagesLayoutProps) => {
  return (
    <>
      <Navbar />
      <div className='flex pt-16'>
        <Sidebar />
        {children}
      </div>
    </>
  );
};

export default MessagesLayout;
