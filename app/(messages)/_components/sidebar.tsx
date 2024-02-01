import { db } from '@/db';
import { users } from '@/db/schema';
import { getSelf } from '@/lib/auth-service';
import { eq, ne } from 'drizzle-orm';
import { SidebarItem } from './sidebar-item';

export const Sidebar = async () => {
  const self = await getSelf();

  const chatters = await db.query.users.findMany({
    where: ne(users.id, self.id),
  });

  return (
    <aside
      className='fixed z-10 flex h-full w-48 flex-col gap-y-1 border 
      border-background bg-secondary pt-1'
    >
      {chatters.map((user, index) => (
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
