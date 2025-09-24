// src/components/organisms/CartFooter/CartFooter.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "../../atoms";
import styles from "./CartFooter.module.css";

type CartFooterProps = {
  items: number;
  selectedCount: number;
  finalAmount: number;
  onOrder?: () => void; // 외부에서 주문 클릭 동작 주입
  ordering?: boolean; // ✅ 주문 진행 중
};

export default function CartFooter({
  items,
  selectedCount,
  finalAmount,
  onOrder,
  ordering = false,
}: CartFooterProps) {
  const navigate = useNavigate();

  // onOrder 있으면 실행, 없으면 /order로 이동
  const handleOrderClick = () => {
    if (ordering) return; // ✅ 진행 중엔 무시
    if (onOrder) onOrder();
    else navigate("/order");
  };

  const disabled = ordering || selectedCount === 0;

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
            variant={!disabled ? "active" : "disabled"}
            className={styles.checkoutButton}
            onClick={handleOrderClick}
            disabled={disabled}
            aria-busy={ordering}
          >
            {ordering ? "주문 처리 중…" : `주문하기 (${selectedCount})`}
          </Button>
        </div>
      )}
    </div>
  );
}
