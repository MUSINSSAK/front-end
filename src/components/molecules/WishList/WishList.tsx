import { Trash } from "lucide-react";
import type { Product } from "../../../types";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./WishList.module.css";

type WishListProps = {
  items: Product[];
};

export default function WishList({ items }: WishListProps) {
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
          <ProductCard key={item.id} product={item} deleteAble={true} />
        ))}
      </div>
    </div>
  );
}
