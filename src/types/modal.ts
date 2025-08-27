export type ConfirmDialogContentProps = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string; // undefined면 OK만 노출
  danger?: boolean;
  onClose: (ok?: boolean) => void;
};
