import type { ConfirmDialogContentProps } from "../../../types/modal";
import { Button } from "../../atoms";
import styles from "./ConfirmDialogContent.module.css";

export default function ConfirmDialogContent({
  title = "확인",
  description,
  confirmText = "확인",
  cancelText = "취소",
  danger,
  onClose,
}: ConfirmDialogContentProps) {
  return (
    <div className={styles.root}>
      <h4 className={styles.title}>{title}</h4>
      {description && <p className={styles.desc}>{description}</p>}

      <div className={styles.actions}>
        {cancelText !== undefined && (
          <Button
            type="button"
            className={styles.btn}
            onClick={() => onClose(false)}
          >
            {cancelText}
          </Button>
        )}
        <Button
          type="button"
          variant={danger ? "warning" : "active"}
          className={styles.btn}
          onClick={() => onClose(true)}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
}
