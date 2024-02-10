'use client';

import { Fragment, useEffect } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { DirectMessageWithConversationAndUser, User } from '@/db/types';
import { useMessageQuery } from '@/hooks/use-messages-query';
import { useMessagesSocket } from '@/hooks/use-messages-socket';
import { MessageType, ParamKey } from '@/lib/types';

import { MessageItem } from './message-item';
import { MessageWelcome } from './message-welcome';
import { Button } from './ui/button';

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
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMessageQuery({
      queryKey: groupId,
      apiUrl,
      paramKey,
      paramValue,
    });
  const addKey = `chat:${groupId}:new-message`;
  const updateKey = `chat:${groupId}:update-message`;
  useMessagesSocket({ queryKey: groupId, addKey, updateKey });

  useEffect(() => {
    console.log({ isIntersecting });
  }, [ref, isIntersecting]);

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
    <div className='no-scrollbar flex w-full flex-1 flex-col items-center overflow-y-auto'>
      <div className='flex-1' />
      {itemsLength === 0 && (
        <MessageWelcome name={groupName} messageType={messageType} />
      )}
      {/* // TODO: Implement fetch next page */}
      {hasNextPage && <div ref={ref} />}
      <div className='mx-auto flex w-full max-w-7xl flex-col-reverse'>
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
                  messageType={messageType}
                  currentUser={currentUser}
                  sender={message.sender}
                  content={message.content}
                  deleted={message.deleted}
                  createdAt={new Date(message.createdAt)}
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
