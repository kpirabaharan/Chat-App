'use client';

import { MessageWithUser } from '@/db/types';
import { useMessagesSocket } from '@/hooks/use-messages-query';

interface MessageListProps {
  initialMessages: MessageWithUser[];
}

export const MessageList = ({ initialMessages }: MessageListProps) => {
  const { messages } = useMessagesSocket({ initialMessages, event: 'chat' });

  if (!messages)
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <p>No Messages</p>
      </div>
    );

  return (
    <ul className='flex flex-1 flex-col-reverse'>
      {messages.map(message => (
        <li key={message.id}>{message.message}</li>
      ))}
    </ul>
  );
};
