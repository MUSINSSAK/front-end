import styles from "./PriceTag.module.css";

type PriceTagProps = { price: number; originalPrice?: number };

export default function PriceTag({ price, originalPrice }: PriceTagProps) {
  return (
    <div className={styles.priceWrapper}>
      <span className={styles.price}>{price.toLocaleString()}원</span>
      {originalPrice && (
        <span className={styles.originalPrice}>
          {originalPrice.toLocaleString()}원
        </span>
      )}
    </div>
  );
}
