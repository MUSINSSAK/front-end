import type { Product } from "../../../types";
import { DiscountBadge, LikeButton, PriceTag } from "../../atoms";
import styles from "./ProductCard.module.css";

type Props = {
  product: Product;
  inWishlist: boolean;
  onToggleWishlist: (id: number) => void;
};

export default function ProductCard({
  product,
  inWishlist,
  onToggleWishlist,
}: Props) {
  return (
    <a
      href={`/products/${product.id}`}
      className={styles.card}
      aria-label={`${product.name} 상세페이지 이동`}
    >
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.name} className={styles.image} />
        {product.discount && <DiscountBadge discount={product.discount} />}
        <LikeButton
          inWishlist={inWishlist}
          onToggleWishlist={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.brand}>{product.brand}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <PriceTag price={product.price} originalPrice={product.originalPrice} />
      </div>
    </a>
  );
}
