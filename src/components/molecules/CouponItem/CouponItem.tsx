import { CircleAlert, CircleCheck } from "lucide-react";
import { Tag } from "../../atoms";
import styles from "./CouponItem.module.css";

type Coupon = {
  discount: string;
  title: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  categories: string[];
  expiryDate: string;
  daysLeft: number;
};

type CouponItemProps = {
  coupon: Coupon;
};

export default function CouponItem({ coupon }: CouponItemProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.discount}>{coupon.discount}</h4>
        {coupon.daysLeft < 8 && (
          <Tag variant={coupon.daysLeft < 4 ? "canceled" : "done"}>
            D-{coupon.daysLeft}
          </Tag>
        )}
      </div>
      <p className={styles.title}>{coupon.title}</p>
      <div className={styles.rules}>
        <p className={styles.rule}>
          <CircleCheck className={styles.icon} />
          <span>{coupon.categories.join(", ")}</span> 적용
        </p>
        <p className={styles.rule}>
          <CircleCheck className={styles.icon} />
          <span>최소 주문 금액 {coupon.minOrder.toLocaleString()}원</span>
        </p>
        {coupon.maxDiscount && (
          <p className={styles.rule}>
            <CircleCheck className={styles.icon} />
            <span>최대 할인 금액 {coupon.maxDiscount.toLocaleString()}원</span>
          </p>
        )}
      </div>
      <p className={styles.expiry}>
        <span className={styles.expiryDate}>
          유효기간: ~{coupon.expiryDate}
        </span>
        {coupon.daysLeft < 4 && (
          <span className={styles.alert}>
            <CircleAlert className={styles.alertIcon} />곧 만료됩니다
          </span>
        )}
      </p>
    </div>
  );
}
