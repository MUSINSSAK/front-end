import { useCallback, useEffect, useState } from "react";
import {
  createReview,
  deleteReview,
  getMyReviews,
  updateReview,
} from "../../../api/reviewApi";
import { useModal } from "../../../contexts/ModalContext";
import type {
  ReviewCreateRequest,
  ReviewUpdateRequest,
  WritableReview,
  WrittenReview,
} from "../../../types/review";
import { ReviewableItem, ReviewItem } from "../../molecules";
import type { ReviewForm } from "../ReviewWriteModal/ReviewWriteModal";
import ReviewWriteModal from "../ReviewWriteModal/ReviewWriteModal";
import styles from "./ReviewsSection.module.css";

export default function ReviewsSection() {
  const [writableReviews, setWritableReviews] = useState<WritableReview[]>([]);
  const [writtenReviews, setWrittenReviews] = useState<WrittenReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { openComponent } = useModal();

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMyReviews();
      setWritableReviews(data.writableReviews);
      setWrittenReviews(data.writtenReviews);
      setError(null);
    } catch (err) {
      console.error("리뷰 목록을 불러오는 데 실패했습니다:", err);
      setError("리뷰 목록을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleCreateReview = async (item: WritableReview) => {
    const result = await openComponent<
      ReviewForm,
      Parameters<typeof ReviewWriteModal>[0]
    >(ReviewWriteModal, {
      product: {
        name: item.productName,
        image: item.thumbnailImageUrl,
        date: item.purchaseDate,
      },
      size: "xl",
      align: "top",
    });

    if (result) {
      const reviewData: ReviewCreateRequest = {
        productId: item.productId,
        rating: result.rating,
        content: result.content,
        reviewImages: result.images,
      };
      try {
        await createReview(reviewData);
        alert("리뷰가 성공적으로 등록되었습니다.");
        fetchReviews();
      } catch (err) {
        console.error("리뷰 작성에 실패했습니다:", err);
        alert("리뷰 작성에 실패했습니다.");
      }
    }
  };

  const handleEditReview = async (review: WrittenReview) => {
    // openComponent의 타입을 수정하고, initialData를 실제로 전달합니다.
    const result = await openComponent<
      ReviewForm,
      Parameters<typeof ReviewWriteModal>[0]
    >(ReviewWriteModal, {
      product: {
        name: review.productName,
        image: review.thumbnailImageUrl,
        date: review.purchaseDate,
      },
      initialData: {
        rating: review.rating,
        content: review.content,
      },
      size: "xl",
      align: "top",
    });

    if (result) {
      const reviewData: ReviewUpdateRequest = {
        content: result.content,
        reviewImages: result.images,
      };
      try {
        await updateReview(review.reviewId, reviewData);
        alert("리뷰가 성공적으로 수정되었습니다.");
        fetchReviews();
      } catch (err) {
        console.error("리뷰 수정에 실패했습니다:", err);
        alert("리뷰 수정에 실패했습니다.");
      }
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId);
        alert("리뷰가 삭제되었습니다.");
        fetchReviews();
      } catch (err) {
        console.error("리뷰 삭제에 실패했습니다:", err);
        alert("리뷰 삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>리뷰 작성 가능한 상품</h3>
        </div>
        <div className={styles.list}>
          {writableReviews.length > 0 ? (
            writableReviews.map((item) => (
              <div key={item.productId} className={styles.listItem}>
                <ReviewableItem
                  item={item}
                  onWriteReview={() => handleCreateReview(item)}
                />
              </div>
            ))
          ) : (
            <p>리뷰를 작성할 상품이 없습니다.</p>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>상품리뷰</h3>
        </div>
        <div className={styles.reviewList}>
          {writtenReviews.length > 0 ? (
            writtenReviews.map((review) => (
              <div key={review.reviewId} className={styles.reviewCard}>
                <ReviewItem
                  review={review}
                  onEdit={() => handleEditReview(review)}
                  onDelete={() => handleDeleteReview(review.reviewId)}
                />
              </div>
            ))
          ) : (
            <p>작성한 리뷰가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
