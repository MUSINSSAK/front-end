import { Checkbox } from "../../atoms";
import styles from "./CartSelectionBar.module.css";

type CartSelectionBarProps = {
  checked: boolean;
  totalCount: number;
  selectedCount: number;
  onToggle: () => void;
};

export default function CartSelectionBar({
  checked,
  totalCount,
  selectedCount,
  onToggle,
}: CartSelectionBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Checkbox
          checked={checked}
          onChange={onToggle}
          className={styles.checkbox}
          aria-checked={checked}
        />
        <span className={styles.label}>전체 선택</span>
        <span className={styles.count}>
          {selectedCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}
