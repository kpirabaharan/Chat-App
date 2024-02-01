import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { MessageWithUser } from '@/db/types';
import { useSocket } from '@/providers/socket-provider';

type ChatSocketProps = {
  initialMessages: MessageWithUser[];
  event: string;
};

export const useMessagesSocket = ({
  initialMessages,
  event,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const router = useRouter();
  const [messages, setMessages] = useState<MessageWithUser[]>(initialMessages);

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (newMessage: MessageWithUser) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    socket.on(event, messageHandler);

    return () => {
      socket.off(event, messageHandler);
    };
  }, [event, router, socket]);

  return { messages };
};
