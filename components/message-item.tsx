import { User } from '@/db/types';
import { UserAvatar } from './user-avatar';

interface MessageItemProps {
  id: string;
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
  sender,
  content,
  deleted,
  socketUrl,
  socketQuery,
  createdAt,
}: MessageItemProps) => {
  return (
    <div className='group relative flex w-full items-center p-4'>
      <div className='flex w-full items-start gap-x-2'>
        <UserAvatar
          name={sender.username}
          imageUrl={sender.imageUrl}
          isOnline={sender.isOnline}
        />
        <div className='flex flex-col gap-y-1'>
          <p className='text-xs text-muted-foreground'>{sender.username}</p>
        </div>
      </div>
    </div>
  );
};
