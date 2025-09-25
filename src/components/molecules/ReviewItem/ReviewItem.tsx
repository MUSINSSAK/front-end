import { Star } from "lucide-react";
import type { WrittenReview } from "../../../types/review";
import { Button } from "../../atoms";
import styles from "./ReviewItem.module.css";

type ReviewItemProps = {
  review: WrittenReview;
  onEdit: () => void; // id를 넘길 필요 없이, 호출만 합니다.
  onDelete: () => void; // id를 넘길 필요 없이, 호출만 합니다.
};

export default function ReviewItem({
  review,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <img
          src={review.thumbnailImageUrl}
          alt={review.productName}
          className={styles.productImage}
        />
        <div>
          <p className={styles.productName}>{review.productName}</p>
          <p className={styles.date}>구매일: {review.purchaseDate}</p>
        </div>
        <div className={styles.actions}>
          <Button className={styles.action} onClick={onEdit}>
            수정
          </Button>
          <Button className={styles.action} onClick={onDelete}>
            삭제
          </Button>
        </div>
      </div>
      <div className={styles.rating}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={`${review.reviewId}-star-${i}`}
            size={16}
            color="var(--color-yellow-400)"
            fill={
              i < review.rating
                ? "var(--color-yellow-400)"
                : "var(--color-white)"
            }
          />
        ))}
      </div>
      <p className={styles.content}>{review.content}</p>
      {review.reviewImages && review.reviewImages.length > 0 && (
        <div className={styles.images}>
          {review.reviewImages.map((src) => (
            <img
              key={src}
              src={src}
              alt={`Review of ${review.productName}`}
              className={styles.reviewImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
