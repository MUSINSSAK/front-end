import type React from "react";
import { useParams } from "react-router-dom";
import { ProductSection } from "../../components/organisms";
import { ShopTemplate } from "../../components/templates";
import { CATEGORIES } from "../../constants/categories";
import type { Product } from "../../types";

const newProducts: Product[] = [
  {
    id: 1,
    brand: "NIKE",
    name: "에어맥스 270 스니커즈",
    price: 159000,
    originalPrice: 189000,
    discount: 16,
    category: "shoes",
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
    category: "outerwear",
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
    category: "pants",
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
    category: "beauty",
    image:
      "https://readdy.ai/api/search-image?query=green%20tea%20serum%20in%20transparent%20bottle%20on%20white%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product9&orientation=squarish",
  },
  {
    id: 12,
    brand: "COS",
    name: "오가닉 코튼 티셔츠",
    price: 29000,
    category: "tops",
    image:
      "https://readdy.ai/api/search-image?query=organic%20cotton%20t-shirt%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product12&orientation=squarish",
  },
  {
    id: 8,
    brand: "LANEIGE",
    name: "수분 크림",
    price: 38000,
    originalPrice: 42000,
    discount: 10,
    category: "beauty",
    image:
      "https://readdy.ai/api/search-image?query=luxury%20moisturizing%20cream%20in%20elegant%20glass%20jar%20on%20clean%20white%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product8&orientation=squarish",
  },

  {
    id: 13,
    brand: "MANGO",
    name: "리넨 셔츠",
    price: 45000,
    category: "tops",
    image:
      "https://readdy.ai/api/search-image?query=light%20linen%20shirt%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product13&orientation=squarish",
  },
  {
    id: 14,
    brand: "CONVERSE",
    name: "척 테일러 올스타",
    price: 79000,
    category: "shoes",
    image:
      "https://readdy.ai/api/search-image?query=classic%20white%20canvas%20sneakers%20on%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product14&orientation=squarish",
  },
  {
    id: 15,
    brand: "MULBERRY",
    name: "베이시스 백",
    price: 450000,
    category: "bags",
    image:
      "https://readdy.ai/api/search-image?query=luxury%20brown%20leather%20handbag%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product15&orientation=squarish",
  },
  {
    id: 16,
    brand: "SK-II",
    name: "페이셜 트리트먼트 에센스",
    price: 150000,
    category: "beauty",
    image:
      "https://readdy.ai/api/search-image?query=luxury%20facial%20essence%20bottle%20on%20white%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product16&orientation=squarish",
  },
  {
    id: 17,
    brand: "ADIDAS",
    name: "스탠 스미스 스니커즈",
    price: 119000,
    category: "shoes",
    image:
      "https://readdy.ai/api/search-image?query=classic%20white%20leather%20sneakers%20on%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product17&orientation=squarish",
  },
];

const Category: React.FC = () => {
  const { cat } = useParams<{ cat: string }>();
  const category = CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0];

  return (
    <div>
      <ShopTemplate>
        <ProductSection
          title={category.name}
          numberOfProducts={true}
          products={newProducts}
          selectedCategory={category.id}
        />
      </ShopTemplate>
    </div>
  );
};

export default Category;
