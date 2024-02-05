import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar } from './ui/avatar';
import { UserAvatar } from './user-avatar';

interface DirectMessageUserProps {
  receiverId: string;
  name: string;
  imageUrl: string;
  onSubmit: (receiverId: string) => void;
}

export const DirectMessageUser = ({
  receiverId,
  name,
  imageUrl,
  onSubmit,
}: DirectMessageUserProps) => {
  const handleSubmit = () => {
    onSubmit(receiverId);
  };

  return (
    <Button
      type={'submit'}
      variant={'outline'}
      className='flex h-14 flex-row justify-between'
      onClick={handleSubmit}
    >
      <UserAvatar name={name} imageUrl={imageUrl} isOnline={false} />
      <p className='text-base'>{name}</p>
      <PlusCircle size={20} />
    </Button>
  );
};
