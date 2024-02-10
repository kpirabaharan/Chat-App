import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { User } from '@/db/types';
import { MessageFormValues, MessageType, messageSchema } from '@/lib/types.d';

import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';
import { UserAvatar } from './user-avatar';

interface MessageItemProps {
  id: string;
  messageType: MessageType;
  sender: User;
  currentUser: User;
  content: string;
  deleted: boolean;
  socketUrl: string;
  socketQuery: Record<string, any>;
  createdAt: Date;
}

export const MessageItem = ({
  id,
  messageType,
  sender,
  currentUser,
  content,
  deleted,
  socketUrl,
  socketQuery,
  createdAt,
}: MessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const isDayApart = Date.now() - createdAt.getTime() > 86400000;
  const timestamp = isDayApart
    ? format(createdAt, 'MM/dd/yy HH:mm')
    : format(createdAt, 'HH:mm');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onSubmit = async ({ message }: MessageFormValues) => {};

  return sender.id === currentUser.id ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='relative w-full p-4'>
          <div className='group flex h-full w-full flex-row-reverse items-end gap-x-2'>
            <UserAvatar
              name={sender.username}
              imageUrl={sender.imageUrl}
              isOnline={sender.isOnline}
            />
            {!isEditing ? (
              <>
                <div className='flex max-w-screen-md flex-col items-start gap-y-1'>
                  <p className='rounded-xl bg-gray-500 p-2 text-sm'>
                    {content}
                  </p>
                </div>
                <p className='text-end text-xs text-muted-foreground lg:whitespace-nowrap'>
                  {timestamp}
                </p>
                <Edit2Icon
                  size={20}
                  className='my-auto shrink-0 cursor-pointer text-muted-foreground opacity-0 transition group-hover:opacity-100'
                  onClick={handleEdit}
                />
                <Trash2Icon
                  size={20}
                  className='my-auto shrink-0 cursor-pointer text-red-700 opacity-0 transition group-hover:opacity-100'
                />
              </>
            ) : (
              <div>
                <FormField
                  name={'message'}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='col-span-6 w-full md:col-span-5'>
                      <FormControl>
                        <Input disabled={isLoading} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className='flex flex-row pt-1'>
                  <p className='text-xs'>
                    escape to{' '}
                    <span
                      className='text-blue-500 hover:underline'
                      onClick={() => {
                        setIsEditing(false);
                      }}
                    >
                      cancel
                    </span>{' '}
                    · enter to{' '}
                    <span className='text-blue-500 hover:underline'>save</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </Form>
  ) : (
    <div className='relative w-full p-4'>
      <div className='group flex w-full flex-row items-end gap-x-2'>
        <UserAvatar
          name={sender.username}
          imageUrl={sender.imageUrl}
          isOnline={sender.isOnline}
        />
        <div className='flex max-w-screen-md flex-col items-start gap-y-1'>
          {messageType !== 'direct' && (
            <p className='text-xs text-muted-foreground'>{sender.username}</p>
          )}
          <p className='rounded-xl bg-gray-700 p-2 text-sm'>{content}</p>
        </div>
        <p className='text-xs text-muted-foreground lg:whitespace-nowrap'>
          {timestamp}
        </p>
      </div>
    </div>
  );
};
