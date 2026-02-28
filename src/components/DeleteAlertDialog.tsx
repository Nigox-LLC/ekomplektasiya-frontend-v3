import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteAlertDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = "OK",
  cancelText = "Bekor qilish",
  destructive,
  loading,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null; // ✅ ENG MUHIM FIX

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()} // ✅ ichiga bosganda backdrop cancel bo‘lib ketmasin
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h3
              id="confirm-dialog-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              {title}
            </h3>

            <div
              id="confirm-dialog-desc"
              className="mt-4 text-sm text-gray-600 dark:text-gray-300"
            >
              {message}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 disabled:opacity-50"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                  destructive
                    ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {loading ? "Yaratilmoqda..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlertDialog;