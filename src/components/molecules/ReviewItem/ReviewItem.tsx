import { useLocation } from "react-router-dom";
import type { WrittenReview } from "../../../types/review";
import { Button, RatingStars } from "../../atoms";
import styles from "./ReviewItem.module.css";

type ReviewItemProps = {
  review: WrittenReview;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function ReviewItem({
  review,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  const location = useLocation();
  const isMypage = location.pathname === "/mypage";

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {review?.thumbnailImageUrl && (
          <img
            src={review.thumbnailImageUrl}
            alt={review.productName}
            className={styles.productImage}
          />
        )}
        <div>
          {isMypage && (
            <p className={styles.productName}>{review?.productName}</p>
          )}
          <span className={styles.author}>{review?.author}</span>
          <p className={styles.date}>{review?.purchaseDate}</p>
        </div>
        {isMypage && (
          <div className={styles.actions}>
            <Button
              className={styles.action}
              onClick={() => onEdit?.(review.reviewId)}
            >
              수정
            </Button>
            <Button
              className={styles.action}
              onClick={() => onDelete?.(review.reviewId)}
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      <RatingStars rating={review.rating} />
      <p className={styles.content}>{review.content}</p>
      {review.reviewImages && review.reviewImages.length > 0 && (
        <div className={styles.images}>
          {review.reviewImages.map((src) => (
            <img
              key={src}
              src={src}
              alt={`Review of ${review?.productName}`}
              className={styles.reviewImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
