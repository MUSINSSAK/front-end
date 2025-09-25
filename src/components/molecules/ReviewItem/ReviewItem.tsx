import { useLocation } from "react-router-dom";
import type { Review } from "../../../types/types";
import { Button, RatingStars } from "../../atoms";
import styles from "./ReviewItem.module.css";

type ReviewItemProps = {
  review: Review;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function ReviewItem({
  review,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  const { pathname } = useLocation();
  const isMypage = pathname === "/mypage";

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {review?.product?.image && (
          <img
            src={review.product.image}
            alt={review.product.name}
            className={styles.productImage}
          />
        )}
        <div>
          {isMypage && (
            <p className={styles.productName}>{review?.product?.name}</p>
          )}
          <span className={styles.author}>{review?.author}</span>
          <p className={styles.date}>{review?.product?.date}</p>
        </div>
        {isMypage && (
          <div className={styles.actions}>
            <Button
              className={styles.action}
              onClick={() => onEdit?.(review.id)}
            >
              수정
            </Button>
            <Button
              className={styles.action}
              onClick={() => onDelete?.(review.id)}
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      <RatingStars rating={review.rating} />
      <p className={styles.content}>{review.content}</p>
      {review.images && (
        <div className={styles.images}>
          {review.images.map((src) => (
            <img
              key={src}
              src={src}
              alt={`Review of ${review?.product?.name}`}
              className={styles.reviewImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
