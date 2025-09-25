import type { WrittenReview } from "../../../types/review";
import { Select } from "../../atoms";
import { ReviewItem } from "../../molecules";
import styles from "./ReviewsSection.module.css";

type Props = {
  reviews: WrittenReview[];
  sortOption: string;
  onSortChange: (opt: string) => void;
};

export default function ProductReview({
  reviews,
  sortOption,
  onSortChange,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>상품 리뷰 ({reviews.length})</h3>
        <Select
          aria-label="리뷰 정렬"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className={styles.select}
        >
          <option value="latest">최신순</option>
          <option value="highest">평점 높은순</option>
          <option value="lowest">평점 낮은순</option>
        </Select>
      </div>

      <div className={styles.list}>
        {reviews.map((r) => (
          <ReviewItem key={r.reviewId} review={r} />
        ))}
      </div>
    </div>
  );
}
