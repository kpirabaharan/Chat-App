'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { DirectMessageUser } from '@/components/direct-message-user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, User } from '@/db/types';

interface NewDirectMessageModalProps {
  users: User[];
}

export const NewDirectMessageModal = ({
  users,
}: NewDirectMessageModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onSubmit = async (receiverId: string) => {
    try {
      const { data: newConversation }: { data: Conversation } =
        await axios.post('/api/conversation', {
          receiverId,
        });
      toast.success('Conversation started');
      setIsOpen(false);
      router.push(`/direct-messages/${newConversation.id}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogTrigger asChild>
        <Button
          className='mx-1'
          variant={'outline'}
          onClick={() => setIsOpen(true)}
        >
          New Direct Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Direct Message</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col items-end gap-y-2'>
          <Input placeholder='Search' />
          <ScrollArea type={'always'} className='w-full'>
            <ul className='flex h-56 w-full flex-col gap-y-2 pr-4'>
              {users.map((user, index) => (
                <DirectMessageUser
                  key={index}
                  receiverId={user.id}
                  name={user.username}
                  imageUrl={user.imageUrl}
                  onSubmit={onSubmit}
                />
              ))}
            </ul>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
