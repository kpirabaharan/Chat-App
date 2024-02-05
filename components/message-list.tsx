'use client';

import { useMessageQuery } from '@/hooks/use-messages-query';
import { MessageType, ParamKey } from '@/lib/types';
import { MessageWelcome } from './message-welcome';

interface MessageListProps {
  groupName: string;
  groupId: string;
  apiUrl: string;
  paramKey: ParamKey;
  paramValue: string;
  socketUrl: string;
  messageType: MessageType;
  query: Record<string, any>;
}

export const MessageList = ({
  groupName,
  groupId,
  apiUrl,
  paramKey,
  paramValue,
  messageType,
  query,
  socketUrl,
}: MessageListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMessageQuery({
      queryKey: groupId,
      apiUrl,
      paramKey,
      paramValue,
    });

  console.log({ data, fetchNextPage, hasNextPage, isFetchingNextPage, status });

  if (status === 'pending') {
    return (
      <div className='flex flex-1 flex-col justify-center text-center'>
        Loading...
      </div>
    );
  }

  if (status === 'error') {
    <div className='flex flex-1 flex-col justify-center text-center'>
      Something went wrong!
    </div>;
  }

  return (
    <div className='flex flex-1 flex-col justify-center overflow-y-auto py-4 text-center'>
      {!hasNextPage && <div className='flex-1' />}
      {!hasNextPage && (
        <MessageWelcome name={groupName} messageType={messageType} />
      )}
      {/* // TODO: Implement fetch next page */}
      <div className='flex flex-col'>
        {data?.pages.map((group, i) => {
          console.log(group);
          return <div key={i}></div>;
        })}
      </div>
    </div>
  );
};
