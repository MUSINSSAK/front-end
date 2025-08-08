import type { Review } from "../../../types";
import { Button } from "../../atoms";
import styles from "./ReviewableItem.module.css";

export default function ReviewableItem({
  item,
}: {
  item: Pick<Review, "id" | "product">;
}) {
  return (
    <div className={styles.reviewableItem}>
      <div className={styles.itemInfo}>
        <div className={styles.itemImageWrapper}>
          <img
            src={item.product.image}
            alt={item.product.name}
            className={styles.itemImage}
          />
        </div>
        <div className={styles.itemDetails}>
          <p className={styles.itemName}>{item.product.name}</p>
          <p className={styles.itemDate}>구매일: {item.product.date}</p>
        </div>
      </div>
      <Button type="button" variant="active" className={styles.writeButton}>
        리뷰 작성
      </Button>
    </div>
  );
}
