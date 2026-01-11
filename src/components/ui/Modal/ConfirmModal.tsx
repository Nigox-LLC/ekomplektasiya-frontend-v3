import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
// Reusing modal styles for consistency

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "O'chirish",
  cancelText = 'Bekor qilish',
  isLoading = false,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2 bg-red-50 rounded-md text-red-700">
          <AlertTriangle size={24} />
          <p className="text-sm font-medium">{message}</p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px]"
            disabled={isLoading}
          >
            {isLoading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
