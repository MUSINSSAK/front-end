import { useModal } from "../../../contexts/ModalContext";
import type { Review } from "../../../types/types";
import { Button } from "../../atoms";
import type { ReviewForm } from "../../organisms/ReviewWriteModal/ReviewWriteModal";
import ReviewWriteModal from "../../organisms/ReviewWriteModal/ReviewWriteModal";
import styles from "./ReviewableItem.module.css";

export default function ReviewableItem({
  item,
}: {
  item: Pick<Review, "id" | "product">;
}) {
  const { openComponent } = useModal();

  const handleWrite = async () => {
    // 모달 열기: 작성 완료 시 ReviewForm 반환, 취소/닫기 시 undefined
    const result = await openComponent<
      ReviewForm,
      { product: typeof item.product; onClose: (v?: ReviewForm) => void }
    >(ReviewWriteModal, { product: item.product, size: "xl", align: "top" });

    if (result) {
      // TODO: 서버 전송 or 상태 업데이트
      // await postReview(item.id, result);
      console.log("리뷰 작성 결과", result);
    }
  };

  return (
    <div className={styles.reviewableItem}>
      <div className={styles.itemInfo}>
        <div className={styles.itemImageWrapper}>
          <img
            src={item.product.image}
            alt={item.product.name}
            className={styles.itemImage}
          />
        </div>
        <div className={styles.itemDetails}>
          <p className={styles.itemName}>{item.product.name}</p>
          <p className={styles.itemDate}>구매일: {item.product.date}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="active"
        className={styles.writeButton}
        onClick={handleWrite}
      >
        리뷰 작성
      </Button>
    </div>
  );
}
