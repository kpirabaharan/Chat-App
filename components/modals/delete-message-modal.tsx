import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { useDeleteModal } from '@/store/delete-modal-store';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const DeleteMessageModal = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { apiUrl, isOpen, onClose } = useDeleteModal();

  const onDelete = () => {
    startTransition(async () => {
      try {
        await axios.delete(apiUrl!);
      } catch (err: any) {
        console.log('DELETE_MESSAGE_ERROR', err.message);
        toast.error('Failed to delete message');
      } finally {
        onClose();
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Message</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this message?
        </DialogDescription>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={'destructive'}
            onClick={onDelete}
            disabled={isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
