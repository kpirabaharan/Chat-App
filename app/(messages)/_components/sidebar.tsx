import { getConversationsWithUsers } from '@/lib/conversations-service';
import { getUsersWithoutConversations } from '@/lib/user-service';

import { NewDirectMessageModal } from '@/components/modals/new-direct-message-modal';
import { Button } from '@/components/ui/button';
import { SidebarItem } from './sidebar-item';

export const Sidebar = async () => {
  const conversations = await getConversationsWithUsers();
  const usersWihoutConversations = await getUsersWithoutConversations();

  return (
    <aside
      className='fixed z-10 flex h-full w-48 flex-col gap-y-1 border 
      border-background bg-secondary pt-1'
    >
      <NewDirectMessageModal users={usersWihoutConversations} />
      <Button className='mx-1' variant={'outline'}>
        New Group Message
      </Button>
      {conversations.map((conversation, index) => (
        <SidebarItem
          key={index}
          id={conversation.id}
          name={conversation.user.username}
          imageUrl={conversation.user.imageUrl}
          isOnline={conversation.user.isOnline}
        />
      ))}
    </aside>
  );
};
