import type { Coupon } from "../../../../types/order";
import { CouponModal } from "../../../molecules";
import styles from "../OrderPage.module.css";

type DiscountSectionProps = {
  ids: {
    couponSelect: string;
    pointInput: string;
  };
  coupons: Coupon[];
  selectedCouponId: string;
  onSelectCoupon: (couponId: string) => void;
  onApplyCoupon: (couponId: string) => void;
  onOpenCouponModal: () => void;
  couponModal: {
    isOpen: boolean;
    onClose: () => void;
  };
  pointsUsed: number;
  onChangePoints: (value: number) => void;
  onApplyAllPoints: () => void;
  availablePoints: number;
  minPointUse: number;
  formatCurrency: (value: number) => string;
};

export default function DiscountSection({
  ids,
  coupons,
  selectedCouponId,
  onSelectCoupon,
  onApplyCoupon,
  onOpenCouponModal,
  couponModal,
  pointsUsed,
  onChangePoints,
  onApplyAllPoints,
  availablePoints,
  minPointUse,
  formatCurrency,
}: DiscountSectionProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>할인 적용</h2>

      <div className={styles.formItem}>
        <label className={styles.label} htmlFor={ids.couponSelect}>
          쿠폰
        </label>
        <div className={styles.row}>
          <div className={styles.selectWrap}>
            <select
              id={ids.couponSelect}
              className={styles.select}
              value={selectedCouponId}
              onChange={(event) => onSelectCoupon(event.target.value)}
              onBlur={(event) => onApplyCoupon(event.target.value)}
            >
              <option value="">사용 가능한 쿠폰 선택</option>
              {coupons.map((coupon) => (
                <option key={coupon.id} value={coupon.id}>
                  {coupon.name}
                </option>
              ))}
            </select>
            <span className={styles.chevDownSmall} aria-hidden />
          </div>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={onOpenCouponModal}
          >
            쿠폰 조회
          </button>
        </div>
      </div>

      <div className={styles.formItem}>
        <label className={styles.label} htmlFor={ids.pointInput}>
          포인트
        </label>
        <div className={styles.row}>
          <input
            id={ids.pointInput}
            className={styles.input}
            inputMode="numeric"
            value={pointsUsed || ""}
            onChange={(event) =>
              onChangePoints(Number(event.target.value || 0))
            }
            placeholder="사용할 포인트 입력"
          />
          <button
            type="button"
            className={styles.btnGhost}
            onClick={onApplyAllPoints}
          >
            전액 사용
          </button>
        </div>
        <p className={styles.helper}>
          보유 포인트 {formatCurrency(availablePoints)}
          {minPointUse > 0
            ? ` / 최소 ${formatCurrency(minPointUse)} 이상 사용`
            : ""}
        </p>
      </div>

      <CouponModal
        isOpen={couponModal.isOpen}
        coupons={coupons}
        selectedCouponId={selectedCouponId}
        onSelect={onApplyCoupon}
        onClose={couponModal.onClose}
        formatCurrency={formatCurrency}
      />
    </section>
  );
}
