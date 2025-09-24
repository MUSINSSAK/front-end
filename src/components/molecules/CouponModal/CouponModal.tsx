import type { Coupon } from "../../../types/order";
import styles from "../../organisms/Order/OrderPage.module.css";

type CouponModalProps = {
  isOpen: boolean;
  coupons: Coupon[];
  selectedCouponId: string;
  onSelect: (couponId: string) => void;
  onClose: () => void;
  formatCurrency: (value: number) => string;
};

export default function CouponModal({
  isOpen,
  coupons,
  selectedCouponId,
  onSelect,
  onClose,
  formatCurrency,
}: CouponModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>보유 쿠폰 목록</h3>
          <button
            type="button"
            aria-label="닫기"
            className={styles.iconBtn}
            onClick={onClose}
          >
            <span className={styles.iconClose} aria-hidden />
          </button>
        </div>

        <div className={styles.couponList}>
          {coupons.map((coupon) => {
            const isSelected = selectedCouponId === coupon.id;
            return (
              <button
                key={coupon.id}
                type="button"
                className={`${styles.couponItem} ${
                  isSelected ? styles.couponOn : ""
                }`}
                onClick={() => onSelect(coupon.id)}
              >
                <div className={styles.couponHead}>
                  <h4 className={styles.couponName}>{coupon.name}</h4>
                  <div className={styles.couponBadge}>
                    {coupon.discountRate
                      ? `${coupon.discountRate}%`
                      : `${formatCurrency(coupon.discountAmount)}`}
                  </div>
                </div>
                <p className={styles.couponDesc}>{coupon.description}</p>
                <div className={styles.couponMeta}>
                  <p>최소 주문금액: {formatCurrency(coupon.minOrderAmount)}</p>
                  <p>
                    최대 할인금액: {formatCurrency(coupon.maxDiscountAmount)}
                  </p>
                  <p>유효기간: ~ {coupon.validUntil}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.btnGhost} onClick={onClose}>
            취소
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onClose}>
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
