import { MessageInput } from '@/components/message-input';
import { MessageList } from '@/components/message-list';

const GroupMessagePage = () => {
  return (
    <div className='relative mx-auto flex h-full max-w-7xl flex-col'>
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default GroupMessagePage;
