import styles from "../OrderPage.module.css";

type OrderSummarySectionProps = {
  originalTotal: number;
  cartDiscount: number;
  couponDiscount: number;
  pointsUsed: number;
  shippingFee: number;
  finalAmount: number;
  formatCurrency: (value: number) => string;
};

export default function OrderSummarySection({
  originalTotal,
  cartDiscount,
  couponDiscount,
  pointsUsed,
  shippingFee,
  finalAmount,
  formatCurrency,
}: OrderSummarySectionProps) {
  return (
    <section className={styles.summaryCard}>
      <h3 className={styles.cardTitle}>결제 정보</h3>
      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}>
          <span className={styles.muted}>상품 금액</span>
          <span className={styles.bold}>{formatCurrency(originalTotal)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.muted}>장바구니 할인</span>
          <span className={styles.minus}>- {formatCurrency(cartDiscount)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.muted}>쿠폰 할인</span>
          <span className={styles.minus}>
            - {formatCurrency(couponDiscount)}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.muted}>포인트 사용</span>
          <span className={styles.minus}>- {formatCurrency(pointsUsed)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.muted}>배송비</span>
          <span className={styles.bold}>
            {shippingFee === 0 ? (
              <span className={styles.free}>무료</span>
            ) : (
              formatCurrency(shippingFee)
            )}
          </span>
        </div>
        <div className={styles.summaryTotal}>
          <span>총 결제 금액</span>
          <b>{formatCurrency(finalAmount)}</b>
        </div>
      </div>
    </section>
  );
}
