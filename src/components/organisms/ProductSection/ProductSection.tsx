import { useState } from "react";
import type { Product } from "../../../types";
import { SectionHeader } from "../../atoms";
import { ProductCard } from "../../molecules";
import styles from "./ProductSection.module.css";

type Props = {
  title: string;
  products: Product[];
  selectedCategory: string;
  disableFiltering?: boolean;
  setShowToast: (show: boolean) => void;
};

export default function ProductSection({
  title,
  products,
  selectedCategory,
  disableFiltering = false,
  setShowToast,
}: Props) {
  const listToRender = disableFiltering
    ? products
    : products.filter(
        (p) => selectedCategory === "all" || p.category === selectedCategory,
      );

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
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeader title={title} />
        <div className={styles.grid}>
          {listToRender.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              inWishlist={wishlist.includes(p.id)}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
