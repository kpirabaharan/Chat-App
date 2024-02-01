import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';

interface UserAvatarProps {
  imageUrl: string;
  name: string;
  isOnline: boolean;
}

export const UserAvatar = ({ imageUrl, name, isOnline }: UserAvatarProps) => {
  return (
    <Avatar
      className={cn(
        'cursor-pointer border border-background ring-2 h-8 w-8',
        isOnline ? 'ring-rose-600' : 'ring-gray-600',
      )}
    >
      <AvatarImage src={imageUrl} className='object-cover' />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
};
