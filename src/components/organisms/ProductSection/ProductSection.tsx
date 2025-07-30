import { useState } from "react";
import type { Product } from "../../../types";
import { SectionHeader, Select } from "../../atoms";
import { ProductCard } from "../../molecules";
import styles from "./ProductSection.module.css";

type Props = {
  title: string;
  numberOfProducts?: boolean;
  products: Product[];
  selectedCategory: string;
  disableFiltering?: boolean;
  setShowToast: (show: boolean) => void;
};

export default function ProductSection({
  title,
  numberOfProducts,
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
  const [selected, setSelected] = useState("추천순");

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
        {numberOfProducts ? (
          <div className={styles.header}>
            <p className={styles.count}>총 {listToRender.length}개 상품</p>
            <Select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="recommended">추천순</option>
              <option value="popular">인기순</option>
              <option value="latest">최신순</option>
              <option value="low-to-high">낮은 가격순</option>
              <option value="high-to-low">높은 가격순</option>
            </Select>
          </div>
        ) : null}
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
