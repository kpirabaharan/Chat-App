'use client';

import { useMessageQuery } from '@/hooks/use-messages-query';
import { MessageType, ParamKey } from '@/lib/types';

interface MessageListProps {
  groupId: string;
  apiUrl: string;
  paramKey: ParamKey;
  paramValue: string;
  socketUrl: string;
  type: MessageType;
  query: Record<string, any>;
}

export const MessageList = ({
  groupId,
  apiUrl,
  paramKey,
  paramValue,
}: MessageListProps) => {
  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
  //   useMessageQuery({
  //     queryKey: groupId,
  //     apiUrl,
  //     paramKey,
  //     paramValue,
  //   });

  return (
    <div className='flex flex-1 flex-col justify-center text-center'>
      No Messages
    </div>
  );
};
