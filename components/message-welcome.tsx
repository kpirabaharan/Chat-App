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
      message = `This is the start of your conversation with ${name}`
      break;
    default:
      message = 'Welcome to the public chat!';
      break;
  }

  return (
    <div>
      <p className='text-lg font-semibold'>{message}</p>
    </div>
  );
};
