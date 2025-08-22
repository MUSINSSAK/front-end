import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
};

export default function Modal({
  open,
  onClose,
  closeOnBackdrop = false,
  children,
}: ModalProps) {
  // ESC로 닫기 + 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={closeOnBackdrop ? onClose : undefined}
      onKeyDown={
        closeOnBackdrop
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClose?.();
              }
            }
          : undefined
      }
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
