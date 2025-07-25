import type { Product } from "../../../types";
import { SectionHeader } from "../../atoms";
import { ProductCard } from "../../molecules";
import styles from "./ProductSection.module.css";

type Props = {
  title: string;
  products: Product[];
  selectedCategory: string;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  disableFiltering?: boolean;
};

export default function ProductSection({
  title,
  products,
  selectedCategory,
  wishlist,
  onToggleWishlist,
  disableFiltering = false,
}: Props) {
  const listToRender = disableFiltering
    ? products
    : products.filter(
        (p) => selectedCategory === "전체" || p.category === selectedCategory,
      );

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeader title={title} />
        <div className={styles.grid}>
          {listToRender.slice(0, 10).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              inWishlist={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
