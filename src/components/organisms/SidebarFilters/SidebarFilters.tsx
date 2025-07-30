import { FilterSection, PriceFilter } from "../../molecules";
import styles from "./SidebarFilters.module.css";

type SidebarFiltersProps = {
  brands: string[];
  categories: string[];
  selectedBrands: string[];
  selectedCategories: string[];
  priceRange: [number, number];
  onBrandToggle: (b: string) => void;
  onCategoryToggle: (c: string) => void;
  onPriceChange: (r: [number, number]) => void;
};

export default function SidebarFilters({
  brands,
  categories,
  selectedBrands,
  selectedCategories,
  priceRange,
  onBrandToggle,
  onCategoryToggle,
  onPriceChange,
}: SidebarFiltersProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.box}>
        <div className={styles.header}>
          <span className={styles.title}>필터</span>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => {
              onBrandToggle("");
              onCategoryToggle("");
              onPriceChange([0, 1000000]);
            }}
          >
            초기화
          </button>
        </div>

        <FilterSection
          title="브랜드"
          options={brands}
          selected={selectedBrands}
          onToggle={onBrandToggle}
        />

        <FilterSection
          title="카테고리"
          options={categories}
          selected={selectedCategories}
          onToggle={onCategoryToggle}
        />
        <PriceFilter range={priceRange} onChange={onPriceChange} />
      </div>
    </aside>
  );
}
