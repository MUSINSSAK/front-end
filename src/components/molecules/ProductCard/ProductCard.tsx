import { useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import type { Product } from "../../../types";
import { LikeButton, PriceTag, Tag } from "../../atoms";
import styles from "./ProductCard.module.css";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState<number[]>([
    1, // 예시로 몇 개의 제품 ID를 추가
    2,
    9,
    14,
    7,
  ]);

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
      showToast("상품이 찜 목록에 추가되었습니다.");
    }
  };

  return (
    <a
      href={`/products/${product.id}`}
      className={styles.card}
      aria-label={`${product.name} 상세페이지 이동`}
    >
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.name} className={styles.image} />
        {product.discount && (
          <Tag
            discount={product.discount}
            variant="discount"
            classname={styles.discountBadge}
          />
        )}
        <LikeButton
          inWishlist={wishlist.includes(product.id)}
          onToggleWishlist={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
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
