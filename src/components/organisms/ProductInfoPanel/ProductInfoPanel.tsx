import { RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { NumberStepper, RatingStars } from "../../atoms";
import { SizeSelect } from "../../molecules";
import styles from "./ProductInfoPanel.module.css";

type Props = {
  brand: string;
  title: string;
  rating: number;
  ratingCount: number;
  discountPercent: number;
  price: number;
  originalPrice: number;
  sizes: string[];
  selectedSize: string;
  onChangeSize: (v: string) => void;
  qty: number;
  onChangeQty: (v: number) => void;
};

export default function ProductInfoPanel({
  brand,
  title,
  rating,
  ratingCount,
  discountPercent,
  price,
  originalPrice,
  sizes,
  selectedSize,
  onChangeSize,
  qty,
  onChangeQty,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.headerBlock}>
        <p className={styles.brand}>{brand}</p>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.ratingRow}>
          <RatingStars rating={rating} />
          <span className={styles.ratingCount}>({ratingCount})</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.discountBadge}>{discountPercent}%</span>
          <span className={styles.price}>{price.toLocaleString()}원</span>
          <span className={styles.originalPrice}>
            {originalPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      <SizeSelect sizes={sizes} value={selectedSize} onChange={onChangeSize} />

      <div>
        <h3 className={styles.sectionTitle}>수량</h3>
        <NumberStepper value={qty} onChange={onChangeQty} min={1} max={10} />
      </div>

      <div className={styles.benefits}>
        <div className={styles.benefitRow}>
          <Truck size={20} />
          <span>무료배송 (5만원 이상 구매시)</span>
        </div>
        <div className={styles.benefitRow}>
          <RotateCcw size={20} />
          <span>30일 무료 교환/반품</span>
        </div>
        <div className={styles.benefitRow}>
          <ShieldCheck size={20} />
          <span>정품 보장</span>
        </div>
      </div>
    </div>
  );
}
