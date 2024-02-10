'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { User } from '@/db/types';
import {
  MessageType,
  messageSchema,
  type MessageFormValues,
} from '@/lib/types.d';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  receiver: User;
  type: MessageType;
  apiUrl: string;
  query: Record<string, any>;
}

export const MessageInput = ({
  receiver,
  type,
  apiUrl,
  query,
}: MessageInputProps) => {
  const router = useRouter();
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: '' },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async ({ message }: MessageFormValues) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, {
        message,
      });

      form.reset();
      router.refresh();
    } catch (err: any) {
      console.log('SEND_MESSAGE_ERROR', err.message);
      toast.error('Failed to send message');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid grid-cols-6 gap-2 p-4'
      >
        <FormField
          name={'message'}
          control={form.control}
          render={({ field }) => (
            <FormItem className='col-span-6 w-full md:col-span-5'>
              <FormControl>
                <Input
                  placeholder='Enter message'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='col-span-6 w-full md:col-span-1'>
          <Button
            className='w-full'
            type={'submit'}
            variant={'default'}
            size={'default'}
          >
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
};
