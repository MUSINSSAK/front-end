import { Star, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../atoms";
import styles from "./ReviewWriteModal.module.css";

type ProductMini = { name: string; image: string; date: string };
export type ReviewForm = { rating: number; content: string; images: string[] };

type InitialData = {
  rating: number;
  content: string;
};

type Props = {
  product: ProductMini;
  initialData?: InitialData;
  onClose: (v?: ReviewForm) => void;
};

export default function ReviewWriteModal({
  product,
  initialData,
  onClose,
}: Props) {
  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [content, setContent] = useState(initialData?.content ?? "");
  const isEditMode = initialData !== undefined;
  const canSubmit = rating > 0 && content.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onClose({ rating, content: content.trim(), images: [] });
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h4 className={styles.title}>리뷰 {isEditMode ? "수정" : "작성"}</h4>
        <button
          type="button"
          className={styles.close}
          onClick={() => onClose()}
          aria-label="닫기"
        >
          <X />
        </button>
      </div>

      <div>
        <div className={styles.infoRow}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.thumb}
          />
          <div>
            <div className={styles.name}>{product.name}</div>
            <div className={styles.date}>구매일: {product.date}</div>
          </div>
        </div>

        <div className={styles.rating}>
          <div className={styles.label}>별점</div>
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={`star-${i + 1}`}
              type="button"
              className={styles.starBtn}
              onClick={() => !isEditMode && setRating(i + 1)}
              aria-label={`${i + 1}점`}
              disabled={isEditMode}
            >
              <Star
                size={20}
                color="var(--color-yellow-400)"
                fill={
                  i < rating ? "var(--color-yellow-400)" : "var(--color-white)"
                }
              />
            </button>
          ))}
        </div>

        <div className={styles.textareaGroup}>
          <div className={styles.label}>리뷰 내용</div>
          <textarea
            rows={6}
            placeholder="상품에 대한 솔직한 리뷰를 작성해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          type="button"
          className={`${styles.btn} ${styles.cancel}`}
          onClick={() => onClose()}
        >
          취소
        </Button>
        <Button
          type="button"
          className={`${styles.btn} ${styles.submit}`}
          onClick={submit}
          variant={canSubmit ? "active" : "disabled"}
        >
          {isEditMode ? "수정완료" : "작성완료"}
        </Button>
      </div>
    </div>
  );
}
