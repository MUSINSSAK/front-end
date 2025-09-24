import styles from "../OrderPage.module.css";

type OrderHeaderProps = {
  title: string;
  onBack: () => void;
};

export default function OrderHeader({ title, onBack }: OrderHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        <button
          type="button"
          className={styles.backBtn}
          aria-label="이전 페이지로 이동"
          onClick={onBack}
        >
          <span className={styles.iconArrow} aria-hidden />
        </button>
        <h1 className={styles.headerTitle}>{title}</h1>
      </div>
    </div>
  );
}
