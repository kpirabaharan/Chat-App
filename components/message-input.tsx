'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { messageSchema, type MessageFormValues } from '@/lib/types.d';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem } from './ui/form';

export const MessageInput = () => {
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: '' },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = () => {
    console.log('submit');
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
