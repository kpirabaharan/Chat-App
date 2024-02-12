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

    socket.on(
      updateKey,
      (updatedMessage: DirectMessageWithConversationAndUser) => {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const newData = [...oldData.pages];
          newData[0] = {
            ...newData[0],
            items: newData[0].items.map(
              (item: DirectMessageWithConversationAndUser) => {
                if (item.id === updatedMessage.id) {
                  return updatedMessage;
                }
                return item;
              },
            ),
          };

          return {
            ...oldData,
            pages: newData,
          };
        });
      },
    );

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [addKey, updateKey, queryClient, queryKey, socket]);
};
