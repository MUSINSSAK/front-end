import { LikeButton } from "../../atoms";
import styles from "./ImageGallery.module.css";

type Props = {
  images: string[];
  current: number;
  onChange: (idx: number) => void;
  inWishlist: boolean;
  onToggleWish: () => void;
};

export default function ImageGallery({
  images,
  current,
  onChange,
  inWishlist,
  onToggleWish,
}: Props) {
  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <img
          src={images[current]}
          alt={`상품 이미지 ${current + 1}`}
          className={styles.mainImg}
        />
        <LikeButton inWishlist={inWishlist} onToggleWishlist={onToggleWish} />
      </div>

      <div className={styles.thumbs}>
        {images.map((src, idx) => (
          <button
            type="button"
            key={src}
            onClick={() => onChange(idx)}
            className={`${styles.thumbBtn} ${current === idx ? styles.thumbSelected : ""}`}
            aria-label={`썸네일 ${idx + 1}`}
          >
            <img
              src={src}
              alt={`썸네일 ${idx + 1}`}
              className={styles.thumbImg}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
