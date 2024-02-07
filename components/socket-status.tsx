'use client';

import { useSocket } from '@/providers/socket-provider';

export const SocketStatus = () => {
  const { isConnected } = useSocket();

  return isConnected ? (
    <div className='rounded-xl bg-green-700 px-2 py-1'>
      <p className='text-sm'>Live: Real-time updates</p>
    </div>
  ) : (
    <div className='rounded-xl bg-yellow-700 px-2 py-1'>
      <p className='text-sm'>Fallback: Polling every 1 second</p>
    </div>
  );
};
