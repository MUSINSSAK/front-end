import styles from "./DiscountBadge.module.css";

type DiscountBadgeProps = { discount: number };

export default function DiscountBadge({ discount }: DiscountBadgeProps) {
  return <span className={styles.badge}>-{discount}%</span>;
}
