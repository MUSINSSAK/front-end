import { Eye, Trash } from "lucide-react";
import type { Product } from "../../../types";
import { EmptyState, ProductCard } from "../../molecules";
import styles from "./RecentViewSection.module.css";

const dummyViewlistItems: Product[] = [
  {
    id: 1,
    brand: "NIKE",
    name: "에어맥스 270 스니커즈",
    price: 159000,
    originalPrice: 189000,
    discount: 16,
    category: "신발",
    image:
      "https://readdy.ai/api/search-image?query=modern%20white%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product1&orientation=squarish",
  },
  {
    id: 2,
    brand: "ZARA",
    name: "오버사이즈 블레이저",
    price: 89000,
    originalPrice: 119000,
    discount: 25,
    category: "아우터",
    image:
      "https://readdy.ai/api/search-image?query=elegant%20black%20blazer%20jacket%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product2&orientation=squarish",
  },
  {
    id: 3,
    brand: "H&M",
    name: "코튼 와이드 팬츠",
    price: 39000,
    originalPrice: 49000,
    discount: 20,
    category: "바지",
    image:
      "https://readdy.ai/api/search-image?query=beige%20wide%20leg%20pants%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product3&orientation=squarish",
  },
  {
    id: 9,
    brand: "INNISFREE",
    name: "그린티 세럼",
    price: 28000,
    originalPrice: 35000,
    discount: 20,
    category: "화장품",
    image:
      "https://readdy.ai/api/search-image?query=innisfree%20green%20tea%20serum%20on%20white%20background%20minimalist%20product%20photography%20studio%20lighting&width=400&height=400&seq=product4&orientation=squarish",
  },
];

export default function RecentViewSection() {
  const onDeleteAll = () => {
    // Implement delete all logic here
    console.log("Delete all items");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>최근 본 상품</h3>
        <button
          type="button"
          onClick={onDeleteAll}
          className={styles.buttonText}
        >
          <Trash size={12} color="var(--color-text)" />
          <span>전체 삭제</span>
        </button>
      </div>
      {dummyViewlistItems.length > 0 ? (
        <div className={styles.items}>
          {dummyViewlistItems.map((item) => (
            <ProductCard key={item.id} product={item} deleteAble={true} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Eye}
          title="최근 본 상품이 없습니다"
          description="상품을 둘러보시고 마음에 드는 상품을 확인해보세요."
        />
      )}
    </div>
  );
}
