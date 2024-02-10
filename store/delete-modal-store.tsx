import { create } from 'zustand';

interface DeleteModalStore {
  apiUrl: string | null;
  isOpen: boolean;
  onOpen: (apiUrl: string) => void;
  onClose: () => void;
}

export const useDeleteModal = create<DeleteModalStore>(set => ({
  apiUrl: null,
  isOpen: false,
  onOpen: (apiUrl: string) => set({ isOpen: true, apiUrl }),
  onClose: () => set({ isOpen: false, apiUrl: null }),
}));
