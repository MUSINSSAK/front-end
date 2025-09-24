import styles from "../OrderPage.module.css";

type OrderFixedBarProps = {
  itemCount: number;
  finalAmount: number;
  disabled: boolean;
  onSubmit: () => void;
  formatCurrency: (value: number) => string;
  buttonLabel?: string;
  isProcessing?: boolean;
};

export default function OrderFixedBar({
  itemCount,
  finalAmount,
  disabled,
  onSubmit,
  formatCurrency,
  buttonLabel,
  isProcessing = false,
}: OrderFixedBarProps) {
  const label = buttonLabel ?? `${formatCurrency(finalAmount)} 결제하기`;
  return (
    <div className={styles.fixedBar}>
      <div className={styles.fixedInner}>
        <div className={styles.fixedRight}>
          <p className={styles.fixedMeta}>총 {itemCount}개 상품</p>
          <p className={styles.fixedPrice}>{formatCurrency(finalAmount)}</p>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || isProcessing}
          className={`${styles.payButton} ${disabled || isProcessing ? styles.payButtonDisabled : ""}`}
        >
          {isProcessing ? "결제 처리 중..." : label}
        </button>
      </div>
    </div>
  );
}
