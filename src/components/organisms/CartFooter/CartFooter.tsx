import { useNavigate } from "react-router-dom";
import { Button } from "../../atoms";
import styles from "./CartFooter.module.css";

type CartFooterProps = {
  items: number;
  selectedCount: number;
  finalAmount: number;
  onOrder?: () => void; // ✅ 외부에서 주문 클릭 동작을 주입받음
};

export default function CartFooter({
  items,
  selectedCount,
  finalAmount,
  onOrder,
}: CartFooterProps) {
  const navigate = useNavigate();

  // ✅ 기본 동작: onOrder가 있으면 그걸 실행, 없으면 /order로 이동
  const handleOrderClick = () => {
    if (onOrder) {
      onOrder();
    } else {
      navigate("/order");
    }
  };

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
            onClick={handleOrderClick} // ✅ 수정됨
            disabled={selectedCount === 0}
          >
            주문하기 ({selectedCount})
          </Button>
        </div>
      )}
    </div>
  );
}
