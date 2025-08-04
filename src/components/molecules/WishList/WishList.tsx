import { Trash, X } from "lucide-react";
import type { Product } from "../../../types";
import { PriceTag, Tag } from "../../atoms";
import styles from "./WishList.module.css";

type WishListSectionProps = {
  items: Product[];
};

export default function WishList({ items }: WishListSectionProps) {
  const onDelete = (id: number) => {
    // Implement delete logic here
    console.log(`Delete item with id: ${id}`);
  };

  const onDeleteAll = () => {
    // Implement delete all logic here
    console.log("Delete all items");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>찜한 상품</h3>
        <button
          type="button"
          onClick={onDeleteAll}
          className={styles.buttonText}
        >
          <Trash size={12} color="var(--color-text)" />
          <span>전체 삭제</span>
        </button>
      </div>
      <div className={styles.items}>
        {items.map((item) => (
          <a
            key={item.id}
            href={`/products/${item.id}`}
            className={styles.card}
            aria-label={`${item.name} 상세페이지 이동`}
          >
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.name} className={styles.image} />
              {item.discount && (
                <Tag
                  discount={item.discount}
                  variant="discount"
                  classname={styles.discountBadge}
                />
              )}
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => onDelete(item.id)}
              >
                <X />
              </button>
            </div>
            <div className={styles.info}>
              <p className={styles.brand}>{item.brand}</p>
              <h3 className={styles.name}>{item.name}</h3>
              <PriceTag price={item.price} originalPrice={item.originalPrice} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
