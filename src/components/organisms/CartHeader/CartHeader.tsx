import { Trash2 } from "lucide-react";
import { Checkbox } from "../../atoms";
import styles from "./CartHeader.module.css";

type CartHeaderProps = {
  items: number;
};

export default function CartHeader({ items }: CartHeaderProps) {
  return (
    <div>
      <h3 className={styles.title}>장바구니</h3>
      {items !== 0 && (
        <div className={styles.header}>
          <Checkbox label="전체 선택" className={styles.selectAllCheckbox} />
          <button type="button" className={styles.deleteButton}>
            <Trash2 size={14} />
            <span>선택 삭제</span>
          </button>
        </div>
      )}
    </div>
  );
}
