import { ne } from 'drizzle-orm';

import { db } from '@/db';
import { user } from '@/db/schema';
import { getSelf } from '@/lib/auth-service';

import { NewDirectMessageModal } from '@/components/modals/new-direct-message-modal';
import { Button } from '@/components/ui/button';
import { SidebarItem } from './sidebar-item';

export const Sidebar = async () => {
  const self = await getSelf();

  // TODO: Instead of showing all users, show conversations
  const users = await db.query.user.findMany({
    where: ne(user.id, self.id),
  });

  return (
    <aside
      className='fixed z-10 flex h-full w-48 flex-col gap-y-1 border 
      border-background bg-secondary pt-1'
    >
      <NewDirectMessageModal users={users} />
      <Button className='mx-1' variant={'outline'}>
        New Group Message
      </Button>
      {users.map((user, index) => (
        <SidebarItem
          key={index}
          name={user.username}
          imageUrl={user.imageUrl}
          isOnline={user.isOnline}
        />
      ))}
    </aside>
  );
};
