import { X } from "lucide-react";
import { Modal } from "../../atoms";
import styles from "./Dialog.module.css";

export type DialogProps = {
  open: boolean;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  align?: "center" | "top"; // 상단 고정 등
  showClose?: boolean; // 우측 상단 X 버튼
  classNames?: Partial<{
    panel: string;
    header: string;
    title: string;
    body: string;
    footer: string;
  }>;
  children: React.ReactNode;
};

export default function Dialog({
  open,
  onClose,
  closeOnBackdrop,
  size = "md",
  align = "center",
  showClose = false,
  classNames,
  children,
}: DialogProps) {
  return (
    <Modal open={open} onClose={onClose} closeOnBackdrop={closeOnBackdrop}>
      <div
        role="dialog"
        aria-modal="true"
        className={`${styles.panel} ${styles[size]} ${styles[align]} ${classNames?.panel ?? ""}`}
      >
        {children}
        {showClose && (
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="닫기"
          >
            <X />
          </button>
        )}
      </div>
    </Modal>
  );
}

/* 슬롯용 서브컴포넌트 */
type DialogSubComponentProps = {
  children: React.ReactNode;
  className?: string;
};

Dialog.Header = function Header({
  children,
  className,
}: DialogSubComponentProps) {
  return (
    <div className={`${styles.header} ${className ?? ""}`}>{children}</div>
  );
};
Dialog.Title = function Title({
  children,
  className,
}: DialogSubComponentProps) {
  return <h4 className={`${styles.title} ${className ?? ""}`}>{children}</h4>;
};
Dialog.Body = function Body({ children, className }: DialogSubComponentProps) {
  return <div className={`${styles.body} ${className ?? ""}`}>{children}</div>;
};
Dialog.Footer = function Footer({
  children,
  className,
}: DialogSubComponentProps) {
  return (
    <div className={`${styles.footer} ${className ?? ""}`}>{children}</div>
  );
};
