'use client';

import { useEffect, useState } from 'react';

import { DeleteMessageModal } from '@/components/modals/delete-message-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return <DeleteMessageModal />;
};
