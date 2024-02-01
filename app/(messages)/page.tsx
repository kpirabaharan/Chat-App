import { getMessages } from '@/lib/messages-service';

import { MessageInput } from '@/components/message-input';
import { MessageList } from '@/components/message-list';
import { getSelf } from '@/lib/auth-service';

const GroupMessagePage = async () => {
  const self = await getSelf();
  const messages = await getMessages();

  return (
    <div className='relative mx-auto flex h-full max-w-7xl flex-col'>
      <MessageList initialMessages={messages || []} />
      <MessageInput senderId={self.id} />
    </div>
  );
};

export default GroupMessagePage;
