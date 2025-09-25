import { Star } from "lucide-react";

type Props = { rating: number };

export default function RatingStars({ rating }: Props) {
  return (
    <div>
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
