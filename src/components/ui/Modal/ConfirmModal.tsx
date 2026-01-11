import { ModernModal } from './ModernModal';
import styles from './ModernModal.module.css';

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
    <ModernModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className={styles.body}>
        <p className="text-base text-slate-600 leading-relaxed font-medium">{message}</p>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            className={`${styles.button} ${styles.cancelButton}`}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${styles.button} ${styles.deleteButton}`}
            disabled={isLoading}
          >
            {isLoading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </ModernModal>
  );
};
