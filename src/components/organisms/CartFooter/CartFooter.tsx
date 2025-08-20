import { Button } from "../../atoms";
import styles from "./CartFooter.module.css";

type CartFooterProps = {
  items: number;
  selectedCount: number;
  finalAmount: number;
};

export default function CartFooter({
  items,
  selectedCount,
  finalAmount,
}: CartFooterProps) {
  return (
    <div>
      {items !== 0 && (
        <div className={styles.footer}>
          <div className={styles.footerSummary}>
            <p className={styles.footerText}>총 {selectedCount}개 상품</p>
            <p className={styles.footerText}>
              {finalAmount.toLocaleString()}원
            </p>
          </div>

          <Button
            type="button"
            variant={selectedCount > 0 ? "active" : "disabled"}
            className={styles.checkoutButton}
          >
            주문하기 ({selectedCount})
          </Button>
        </div>
      )}
    </div>
  );
}
