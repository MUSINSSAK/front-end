import styles from "./Tag.module.css";

type BadgeVariant =
  | "default"
  | "discount" /* 할인 */
  | "success" /* 결제완료 */
  | "processing" /* 배송중 */
  | "canceled" /* 취소됨 */
  | "done" /* 배송완료 */;

type BadgeProps = {
  discount?: number;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  classname?: string;
};

export default function Tag({
  discount,
  children,
  variant = "default",
  classname,
}: BadgeProps) {
  const content = typeof discount === "number" ? `-${discount}%` : children;

  return (
    <span className={`${styles.badge} ${styles[variant]} ${classname}`}>
      {content}
    </span>
  );
}
