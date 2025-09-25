import type { WritableReview } from "../../../types/review";
import { Button } from "../../atoms";
import styles from "./ReviewableItem.module.css";

type Props = {
  item: WritableReview;
  onWriteReview: () => void;
};

export default function ReviewableItem({ item, onWriteReview }: Props) {
  return (
    <div className={styles.reviewableItem}>
      <div className={styles.itemInfo}>
        <div className={styles.itemImageWrapper}>
          <img
            src={item.thumbnailImageUrl}
            alt={item.productName}
            className={styles.itemImage}
          />
        </div>
        <div className={styles.itemDetails}>
          <p className={styles.itemName}>{item.productName}</p>
          <p className={styles.itemDate}>구매일: {item.purchaseDate}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="active"
        className={styles.writeButton}
        onClick={onWriteReview}
      >
        리뷰 작성
      </Button>
    </div>
  );
}
