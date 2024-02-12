import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import qs from 'query-string';

import { ParamKey } from '@/lib/types';
import { useSocket } from '@/providers/socket-provider';

interface MessageQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: ParamKey;
  paramValue: string;
}

export const useMessagesQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: MessageQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    var url;

    if (paramKey) {
      url = qs.stringifyUrl(
        {
          url: apiUrl,
          query: { cursor: pageParam, [paramKey]: paramValue },
        },
        { skipNull: true },
      );
    } else {
      url = qs.stringifyUrl(
        {
          url: apiUrl,
          query: { cursor: pageParam },
        },
        { skipNull: true },
      );
    }

    const res = await axios.get(url);
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: undefined,
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: lastPage => lastPage?.nextCursor,
      refetchInterval: isConnected ? 10000 : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
