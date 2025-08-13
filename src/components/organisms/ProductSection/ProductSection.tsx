import { useState } from "react";
import type { Product } from "../../../types/products";
import { SectionHeader, Select } from "../../atoms";
import { ProductCard } from "../../molecules";
import styles from "./ProductSection.module.css";

type Props = {
  title: string;
  numberOfProducts?: boolean;
  products: Product[];
  selectedCategory: string;
  disableFiltering?: boolean;
};

export default function ProductSection({
  title,
  numberOfProducts,
  products,
  selectedCategory,
  disableFiltering = false,
}: Props) {
  const listToRender = disableFiltering
    ? products
    : products.filter(
        (p) => selectedCategory === "all" || p.category === selectedCategory,
      );

  // 원복: 내부에서 정렬 상태를 로컬로 관리
  const [selected, setSelected] = useState("추천순");
  // (참고) option의 value와 맞추려면 "recommended"가 더 일관적입니다.

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
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
