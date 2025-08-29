import { Heart } from "lucide-react";
import styles from "./LikeButton.module.css";

type Props = {
  inWishlist: boolean;
  onToggleWishlist: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function LikeButton({ inWishlist, onToggleWishlist }: Props) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggleWishlist}
      aria-label={inWishlist ? "위시리스트에서 제거" : "위시리스트에 추가"}
    >
      <Heart
        size={17}
        className={inWishlist ? styles.filled : styles.outline}
      />
    </button>
  );
}
