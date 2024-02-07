import { redirect } from 'next/navigation';

import { MessageInput } from '@/components/message-input';
import { MessageList } from '@/components/message-list';
import { User } from '@/db/types';
import { getSelf } from '@/lib/auth-service';
import { getConversationById } from '@/lib/conversations-service';

export const revalidate = 0;

interface DirectMessagesPageProps {
  params: { conversationId: string };
}

const DirectMessagesPage = async ({ params }: DirectMessagesPageProps) => {
  const self = await getSelf();
  const conversation = await getConversationById(params.conversationId);

  if (!conversation) {
    redirect('/');
  }

  const otherUser: User =
    conversation.initiatorId === self.id
      ? conversation.receiver
      : conversation.initiator;

  return (
    <div className='relative flex h-full flex-col'>
      <MessageList
        messageType={'direct'}
        groupName={otherUser.username}
        currentUser={self}
        groupId={conversation.id}
        apiUrl={'/api/direct-messages'}
        paramKey={'conversationId'}
        paramValue={conversation.id}
        socketUrl={'/api/socket/direct-messages'}
        query={{ conversationId: conversation.id }}
      />
      <div className='mx-auto max-w-7xl w-full border rounded-xl'>
        <MessageInput
          type='direct'
          receiver={otherUser}
          apiUrl={'/api/socket/direct-messages'}
          query={{ conversationId: conversation.id }}
        />
      </div>
    </div>
  );
};

export default DirectMessagesPage;
