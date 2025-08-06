import type { Review } from "../../../types";
import { ReviewableItem, ReviewItem } from "../../molecules";
import styles from "./ReviewsSection.module.css";

type ReviewableItemProps = Pick<Review, "id" | "product">;

const reviews: Review[] = [
  {
    id: "review1",
    product: {
      name: "상품 A",
      image:
        "https://readdy.ai/api/search-image?query=modern%20white%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product1&orientation=squarish",
      date: "2023-10-01",
    },
    rating: 5,
    content: "정말 만족스러운 상품이었습니다!",
    images: [
      "https://readdy.ai/api/search-image?query=modern%20white%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product1&orientation=squarish",
    ],
  },
  {
    id: "review2",
    product: {
      name: "상품 B",
      image:
        "https://readdy.ai/api/search-image?query=elegant%20black%20blazer%20jacket%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product2&orientation=squarish",
      date: "2023-10-02",
    },
    rating: 4,
    content: "좋은 품질이지만 배송이 조금 늦었습니다.",
    images: [
      "https://readdy.ai/api/search-image?query=elegant%20black%20blazer%20jacket%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product2&orientation=squarish",
      "https://readdy.ai/api/search-image?query=elegant%20black%20blazer%20jacket%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product2&orientation=squarish",
    ],
  },
  {
    id: "review3",
    product: {
      name: "상품 C",
      image:
        "https://readdy.ai/api/search-image?query=beige%20wide%20leg%20pants%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product3&orientation=squarish",

      date: "2023-10-03",
    },
    rating: 3,
    content: "보통 수준의 상품이었습니다.",
    images: [],
  },
  {
    id: "review4",
    product: {
      name: "상품 D",
      image:
        "https://readdy.ai/api/search-image?query=innisfree%20green%20tea%20serum%20on%20white%20background%20minimalist%20product%20photography%20studio%20lighting&width=400&height=400&seq=product4&orientation=squarish",

      date: "2023-10-04",
    },
    rating: 2,
    content: "기대 이하의 품질이었습니다.",
    images: [
      "https://readdy.ai/api/search-image?query=innisfree%20green%20tea%20serum%20on%20white%20background%20minimalist%20product%20photography%20studio%20lighting&width=400&height=400&seq=product4&orientation=squarish",
    ],
  },
];
const items: ReviewableItemProps[] = [
  {
    id: "item1",
    product: {
      name: "상품 A",
      image:
        "https://readdy.ai/api/search-image?query=modern%20white%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product1&orientation=squarish",
      date: "2023-10-01",
    },
  },
  {
    id: "item2",
    product: {
      name: "상품 B",
      image:
        "https://readdy.ai/api/search-image?query=elegant%20black%20blazer%20jacket%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product2&orientation=squarish",
      date: "2023-10-02",
    },
  },
];

export default function ReviewsSection() {
  const onEdit = (id: string) => {
    // Implement edit logic here
    console.log("Edit review with id:", id);
  };

  const onDelete = (id: string) => {
    // Implement delete logic here
    console.log("Delete review with id:", id);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>리뷰 작성 가능한 상품</h3>
        </div>
        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <ReviewableItem item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>상품리뷰</h3>
        </div>
        <div className={styles.reviewList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <ReviewItem review={review} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
