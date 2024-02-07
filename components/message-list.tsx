'use client';

import { DirectMessageWithConversationAndUser, User } from '@/db/types';
import { useMessageQuery } from '@/hooks/use-messages-query';
import { MessageType, ParamKey } from '@/lib/types';
import { Fragment } from 'react';
import { MessageItem } from './message-item';
import { MessageWelcome } from './message-welcome';

interface MessageListProps {
  groupName: string;
  currentUser: User;
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
  currentUser,
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

  const itemsLength = data?.pages.reduce(
    (acc, group) => acc + group.items.length,
    0,
  );

  return (
    <div className='flex flex-1 flex-col-reverse overflow-y-auto py-4 text-center'>
      {itemsLength === 0 && (
        <MessageWelcome name={groupName} messageType={messageType} />
      )}
      {/* // TODO: Implement fetch next page */}
      <div className='flex flex-col'>
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map(
              (
                message: DirectMessageWithConversationAndUser,
                index: number,
              ) => (
                <MessageItem
                  key={index}
                  id={message.id}
                  currentUser={currentUser}
                  sender={message.sender}
                  content={message.content}
                  deleted={message.deleted}
                  createdAt={message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={query}
                />
              ),
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
