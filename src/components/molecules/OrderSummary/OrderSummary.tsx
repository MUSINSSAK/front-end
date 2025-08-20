import styles from "./OrderSummary.module.css";

type OrderSummaryProps = {
  originalTotal: number;
  discountTotal: number;
  shippingFee: number;
  finalAmount: number;
  freeThreshold?: number;
};

export default function OrderSummary({
  originalTotal,
  discountTotal,
  shippingFee,
  finalAmount,
  freeThreshold = 50000,
}: OrderSummaryProps) {
  const paidProducts = originalTotal - discountTotal;
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>주문 정보</h3>

      <div className={styles.row}>
        <span className={styles.label}>상품 금액</span>
        <span className={styles.value}>{originalTotal.toLocaleString()}원</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>할인 금액</span>
        <span className={styles.valueRed}>
          -{discountTotal.toLocaleString()}원
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>배송비</span>
        <span className={shippingFee === 0 ? styles.valueGreen : styles.value}>
          {shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}
        </span>
      </div>

      <div className={styles.divider}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>총 결제 금액</span>
          <span className={styles.totalValue}>
            {finalAmount.toLocaleString()}원
          </span>
        </div>
      </div>

      {paidProducts < freeThreshold && paidProducts > 0 && (
        <p className={styles.notice}>
          {(freeThreshold - paidProducts).toLocaleString()}원 더 구매하시면
          무료배송입니다
        </p>
      )}
    </div>
  );
}
