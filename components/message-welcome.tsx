import { MessageType } from '@/lib/types';

interface MessageWelcomeProps {
  messageType: MessageType;
  name: string;
}

export const MessageWelcome = ({ messageType, name }: MessageWelcomeProps) => {
  let message = '';

  switch (messageType) {
    case 'group':
      message = `Welcome to the group chat!`;
      break;
    case 'direct':
      message = `Send a message to chat with ${name}.`;
      break;
    default:
      message = 'Welcome to the public chat!';
      break;
  }

  return (
    <div className='flex h-full flex-col justify-center'>
      <p className='text-center text-lg font-semibold'>{message}</p>
    </div>
  );
};
