'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  name: string;
  id: string;
  imageUrl: string;
  isOnline: boolean;
}

export const SidebarItem = ({
  name,
  id,
  imageUrl,
  isOnline,
}: SidebarItemProps) => {
  const pathname = usePathname();

  const url = `/direct-messages/${id}`;

  return (
    <Link href={url}>
      <div
        className={cn(
          'flex h-12 w-full cursor-pointer items-center gap-x-4 px-4 hover:bg-card/50',
          pathname === url && 'bg-gray-500/50',
        )}
      >
        <UserAvatar name={name} imageUrl={imageUrl} isOnline={false} />
        <p className='overflow-hidden overflow-ellipsis whitespace-nowrap text-sm'>
          {name}
        </p>
      </div>
    </Link>
  );
};
