import { format } from 'date-fns';
import { Edit2Icon, Trash2Icon } from 'lucide-react';

import { User } from '@/db/types';

import { MessageType } from '@/lib/types';
import { UserAvatar } from './user-avatar';

interface MessageItemProps {
  id: string;
  messageType: MessageType;
  sender: User;
  currentUser: User;
  content: string;
  deleted: boolean;
  socketUrl: string;
  socketQuery: Record<string, any>;
  createdAt: Date;
}

export const MessageItem = ({
  id,
  messageType,
  sender,
  currentUser,
  content,
  deleted,
  socketUrl,
  socketQuery,
  createdAt,
}: MessageItemProps) => {
  const isDayApart = Date.now() - createdAt.getTime() > 86400000;
  const timestamp = isDayApart
    ? format(createdAt, 'MM/dd/yy HH:mm')
    : format(createdAt, 'HH:mm');

  return sender.id === currentUser.id ? (
    <div className='relative w-full p-4'>
      <div className='group flex h-full w-full flex-row-reverse items-end gap-x-2'>
        <UserAvatar
          name={sender.username}
          imageUrl={sender.imageUrl}
          isOnline={sender.isOnline}
        />
        <div className='flex max-w-screen-md flex-col items-start gap-y-1'>
          <p className='rounded-xl bg-gray-500 p-2 text-sm'>{content}</p>
        </div>
        <p className='text-end text-xs text-muted-foreground lg:whitespace-nowrap'>
          {timestamp}
        </p>
        <Edit2Icon
          size={20}
          className='my-auto shrink-0 cursor-pointer text-muted-foreground opacity-0 transition group-hover:opacity-100'
        />
        <Trash2Icon
          size={20}
          className='my-auto shrink-0 cursor-pointer text-red-700 opacity-0 transition group-hover:opacity-100'
        />
      </div>
    </div>
  ) : (
    <div className='relative w-full p-4'>
      <div className='group flex w-full flex-row items-end gap-x-2'>
        <UserAvatar
          name={sender.username}
          imageUrl={sender.imageUrl}
          isOnline={sender.isOnline}
        />
        <div className='flex max-w-screen-md flex-col items-start gap-y-1'>
          {messageType !== 'direct' && (
            <p className='text-xs text-muted-foreground'>{sender.username}</p>
          )}
          <p className='rounded-xl bg-gray-700 p-2 text-sm'>{content}</p>
        </div>
        <p className='text-xs text-muted-foreground lg:whitespace-nowrap'>
          {timestamp}
        </p>
      </div>
    </div>
  );
};
