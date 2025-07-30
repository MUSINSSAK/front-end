import { Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "../../atoms";
import styles from "./ReviewItem.module.css";

type Review = {
  id: string;
  product: { name: string; image: string; date: string };
  rating: number;
  content: string;
  images?: string[];
};

type ReviewItemProps = {
  review: Review;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
        <img
          src={review.product.image}
          alt=""
          className={styles.productImage}
        />
        <div>
          <p className={styles.productName}>{review.product.name}</p>
          <p className={styles.date}>{review.product.date}</p>
        </div>
        {isMypage && (
          <div className={styles.actions}>
            <Button className={styles.action} onClick={() => onEdit(review.id)}>
              수정
            </Button>
            <Button
              className={styles.action}
              onClick={() => onDelete(review.id)}
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      <div className={styles.rating}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={`${review.id}-star-${i}`}
            size={16}
            color="#FACC15"
            fill={i < review.rating ? "#FACC15" : "#fff"}
          />
        ))}
      </div>
      <p className={styles.content}>{review.content}</p>
      {review.images && review.images.length > 0 && (
        <div className={styles.images}>
          {review.images.map((src) => (
            <img
              key={src}
              src={src}
              alt={`Review of ${review.product.name}`}
              className={styles.reviewImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
