import { useCallback, useEffect, useState } from "react";
import { getProductReviews } from "../../../api/products";
import type { WrittenReview } from "../../../types/review";
import { Select } from "../../atoms";
import { ReviewItem } from "../../molecules";
import styles from "./ReviewsSection.module.css";

type Props = {
  productId: number;
};

export default function ProductReview({ productId }: Props) {
  type SortKey = "latest" | "high" | "low";

  const [reviews, setReviews] = useState<WrittenReview[]>([]);
  const [sort, setSort] = useState<SortKey>("latest");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(
    async (reset = false, pageOverride?: number, sortOverride?: SortKey) => {
      try {
        setLoading(true);
        setError(null);

        const nextSort = sortOverride ?? sort;
        const nextPage = pageOverride ?? (reset ? 1 : page);

        const data = await getProductReviews(productId, {
          sort: nextSort,
          page: nextPage,
          size: 10,
        });

        setTotal(data.totalReviews);
        setHasNext(data.hasNext);

        const mapped: WrittenReview[] = data.reviews.map((r) => ({
          reviewId: r.reviewId,
          productId: data.productId,
          productName: "", // 서버 응답에 없으면 빈 값
          thumbnailImageUrl: "", // 서버 응답에 없으면 빈 값
          purchaseDate: r.purchaseDate,
          rating: r.rating,
          author: r.author,
          content: r.content,
          reviewImages: r.reviewImages ? [""] : [],
        }));

        if (reset || nextPage === 1) setReviews(mapped);
        else setReviews((prev) => [...prev, ...mapped]);

        setPage(nextPage);
        setSort(nextSort);
      } catch {
        setError("리뷰 목록을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    },
    [productId, sort, page],
  );

  // 첫 로드 및 정렬 변경 시 실행
  useEffect(() => {
    fetchReviews(true, 1);
  }, [fetchReviews]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>상품 리뷰 ({total})</h3>
        <Select
          aria-label="리뷰 정렬"
          value={sort}
          onChange={(e) => {
            const v = e.target.value as SortKey;
            fetchReviews(true, 1, v);
          }}
          className={styles.select}
        >
          <option value="latest">최신순</option>
          <option value="high">평점 높은순</option>
          <option value="low">평점 낮은순</option>
        </Select>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && reviews.length === 0 && (
        <p className={styles.loading}>불러오는 중…</p>
      )}
      {!loading && !error && reviews.length === 0 && (
        <p className={styles.empty}>등록된 리뷰가 없습니다.</p>
      )}

      <div className={styles.list}>
        {reviews.map((r) => (
          <ReviewItem key={r.reviewId} review={r} />
        ))}
      </div>

      {hasNext && (
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.moreBtn}
            disabled={loading}
            onClick={() => fetchReviews(false, page + 1)}
          >
            {loading ? "불러오는 중…" : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
