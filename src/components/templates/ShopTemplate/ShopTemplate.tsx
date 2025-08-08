import { useState } from "react";
import { useParams } from "react-router-dom";
import { CATEGORIES } from "../../../constants/categories";
import { Breadcrumb } from "../../molecules";
import { SidebarFilters } from "../../organisms";
import styles from "./ShopTemplate.module.css";

type ShopTemplateProps = {
  children: React.ReactNode;
};

export default function ShopTemplate({ children }: ShopTemplateProps) {
  const { cat } = useParams<{ cat: string }>();
  const category = CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0];

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    category.name,
  ]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handleCategoryToggle = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName],
    );
  };

  return (
    <div className={styles.wrapper}>
      <Breadcrumb path={[category.name]} />

      <div className={styles.contentWrapper}>
        <SidebarFilters
          brands={[
            "NIKE",
            "ZARA",
            "H&M",
            "INNISFREE",
            "COS",
            "LANEIGE",
            "MANGO",
            "CONVERSE",
            "MULBERRY",
            "SK-II",
            "ADIDAS",
          ]}
          categories={CATEGORIES.map((c) => c.name)}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategories}
          priceRange={priceRange}
          onBrandToggle={handleBrandToggle}
          onCategoryToggle={handleCategoryToggle}
          onPriceChange={setPriceRange}
        />
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
