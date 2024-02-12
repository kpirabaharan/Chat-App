'use client';

import { ElementRef, Fragment, useEffect, useRef, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { useIntersectionObserver } from 'usehooks-ts';

import { DirectMessageWithConversationAndUser, User } from '@/db/types';
import { useMessagesQuery } from '@/hooks/use-messages-query';
import { useMessagesSocket } from '@/hooks/use-messages-socket';
import { MessageType, ParamKey } from '@/lib/types';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessagesScroll } from '@/hooks/use-messages-scroll';
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
  const scrollRef = useRef<ElementRef<'div'>>(null);
  const [chatHeight, setChatHeight] = useState(0);

  const { isIntersecting: isIntersectingTop, ref: topRef } =
    useIntersectionObserver({
      threshold: 0.5,
    });
  const { isIntersecting: isIntersectingBot, ref: botRef } =
    useIntersectionObserver({
      threshold: 0.5,
    });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMessagesQuery({
      queryKey: groupId,
      apiUrl,
      paramKey,
      paramValue,
    });
  const addKey = `chat:${groupId}:new-message`;
  const updateKey = `chat:${groupId}:update-message`;
  useMessagesSocket({ queryKey: groupId, addKey, updateKey });

  const itemsLength: number =
    data?.pages.reduce((acc, group) => acc + group.items.length, 0) ?? 0;

  useEffect(() => {
    if (isIntersectingTop && hasNextPage) {
      setChatHeight(scrollRef.current?.scrollHeight ?? 0);
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isIntersectingTop]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(
        0,
        scrollRef.current.scrollHeight - chatHeight,
      );
    }
  }, [chatHeight]);

  const scrollHandle = () => {
    if (scrollRef.current) {
      console.log({ scrollHeight: scrollRef.current?.scrollHeight });
      console.log({ scrollTop: scrollRef.current?.scrollTop });
      console.log({ clientHeight: scrollRef.current?.clientHeight });
    }
  };

  if (status === 'pending') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <SyncLoader color={'#4F46E5'} />
      </div>
    );
  }

  if (status === 'error') {
    <div className='flex flex-1 flex-col justify-center text-center'>
      Something went wrong!
    </div>;
  }

  return (
    <div className='no-scrollbar flex w-full flex-1 flex-col items-center overflow-y-auto'>
      <div className='flex-1' />
      {itemsLength === 0 && (
        <MessageWelcome name={groupName} messageType={messageType} />
      )}
      {isFetchingNextPage && <SyncLoader color={'#4F46E5'} />}
      {hasNextPage && <div ref={topRef} className='h-4 w-full bg-red-600' />}
      <div
        ref={scrollRef}
        className='overflow-y- mx-auto flex w-full max-w-7xl flex-col-reverse'
      >
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
                  edited={message.edited}
                  createdAt={new Date(message.createdAt)}
                  socketUrl={socketUrl}
                  socketQuery={query}
                />
              ),
            )}
          </Fragment>
        ))}
      </div>
      <div ref={botRef} className='h-1 w-full bg-blue-600' />
      <Button className='absolute bottom-4 left-1/2' onClick={scrollHandle}>
        Scroll
      </Button>
    </div>
  );
};
