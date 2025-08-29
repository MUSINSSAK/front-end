import styles from "./Badge.module.css";

type BadgeProps = {
  count: number;
};

export default function Badge({ count }: BadgeProps) {
  return <span className={styles.badge}>{count}</span>;
}
