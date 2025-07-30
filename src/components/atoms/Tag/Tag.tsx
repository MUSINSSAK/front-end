import styles from "./Tag.module.css";

type BadgeVariant = "default" | "discount";

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
