'use client';

import { useSocket } from '@/providers/socket-provider';

export const SocketStatus = () => {
  const { isConnected } = useSocket();

  return isConnected ? (
    <div className='flex items-center gap-x-2 mr-2'>
      <div className='h-2 w-2 rounded-full bg-green-700' />
      <p className='text-sm'>Live</p>
    </div>
  ) : (
    <div className='flex items-center gap-x-2 mr-2'>
    <div className='h-2 w-2 rounded-full bg-yellow-700' />
    <p className='text-sm'>Polling</p>
  </div>
  );
};
