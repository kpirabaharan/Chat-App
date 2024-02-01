import { UserAvatar } from '@/components/user-avatar';

interface SidebarItemProps {
  name: string;
  imageUrl: string;
  isOnline: boolean;
}

export const SidebarItem = ({ name, imageUrl, isOnline }: SidebarItemProps) => {
  return (
    <div className='flex h-12 w-full cursor-pointer items-center gap-x-4 px-4 hover:bg-card/50'>
      <UserAvatar name={name} imageUrl={imageUrl} isOnline={false} />
      <p className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm'>
        {name}
      </p>
    </div>
  );
};
