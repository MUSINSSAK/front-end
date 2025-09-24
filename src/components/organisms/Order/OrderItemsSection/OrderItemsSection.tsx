import { useState } from "react";
import type { OrderItem } from "../../../../types/order";
import styles from "../OrderPage.module.css";

type OrderItemsSectionProps = {
  items: OrderItem[];
  formatCurrency: (value: number) => string;
  defaultOpen?: boolean;
  loading?: boolean;
  errorMessage?: string | null;
};

export default function OrderItemsSection({
  items,
  formatCurrency,
  defaultOpen = false,
  loading = false,
  errorMessage = null,
}: OrderItemsSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const hasItems = items.length > 0;

  return (
    <section className={styles.card}>
      <button
        type="button"
        className={styles.cardTitleRow}
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2 className={styles.cardTitle}>주문 상품 ({items.length}개)</h2>
        <span
          className={`${styles.chev} ${open ? styles.chevUp : styles.chevDown}`}
          aria-hidden
        />
      </button>

      {loading && (
        <div className={styles.centerMuted}>주문 상품을 불러오는 중입니다.</div>
      )}

      {!loading && errorMessage && (
        <div className={styles.errorBox}>{errorMessage}</div>
      )}

      {open && !loading && hasItems && (
        <div className={styles.itemsStack}>
          {items.map((item, index) => (
            <div key={item.id} className={styles.itemRow}>
              <div className={styles.thumbBox}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.thumb}
                />
              </div>
              <div className={styles.itemMeta}>
                <p className={styles.itemBrand}>{item.brand}</p>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemOpt}>
                  옵션 {item.size} | 수량: {item.quantity}개
                </p>
                <p className={styles.itemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
              {index < items.length - 1 && (
                <div className={styles.rowDivider} />
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !errorMessage && !hasItems && open && (
        <div className={styles.centerMuted}>주문 상품 정보가 없습니다.</div>
      )}
    </section>
  );
}
