import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { DirectMessageWithConversationAndUser } from '@/db/types';
import { useSocket } from '@/providers/socket-provider';

interface MessageSocketProps {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

export const useMessagesSocket = ({
  addKey,
  updateKey,
  queryKey,
}: MessageSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(addKey, (newMessage: DirectMessageWithConversationAndUser) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [newMessage],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [newMessage, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
    };
  }, [addKey, queryClient, queryKey, socket]);
};
