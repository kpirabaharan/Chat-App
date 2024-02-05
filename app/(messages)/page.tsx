import { getMessages } from '@/lib/messages-service';

import { MessageInput } from '@/components/message-input';
import { MessageList } from '@/components/message-list';
import { getSelf } from '@/lib/auth-service';

export const revalidate = 0;

const GroupMessagePage = async () => {
  const self = await getSelf();
  const messages = await getMessages();

  return (
    <div className='relative mx-auto flex h-full max-w-7xl flex-col'>
      {/* <MessageList
        apiUrl={'/api/all-messages'}
        groupId={'all'}
        paramKey={null}
        paramValue=''
        socketUrl='/api/socket/all'
        type={'all'}
        query={{}}
      /> */}
      <MessageInput
        receiver={self.id}
        type={'all'}
        apiUrl='/api/socket/direct-messages'
        query={{}}
      />
    </div>
  );
};

export default GroupMessagePage;
