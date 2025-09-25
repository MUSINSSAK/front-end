import { Star } from "lucide-react";
import styles from "./RatingStars.module.css";

type Props = { rating: number };

export default function RatingStars({ rating }: Props) {
  return (
    <div className={styles.rating}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={`star-${rating}-star${i + 1}`}
          size={16}
          color="var(--color-yellow-400)"
          fill={i < rating ? "var(--color-yellow-400)" : "var(--color-white)"}
        />
      ))}
    </div>
  );
}
