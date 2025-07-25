import type React from "react";
import { useState } from "react";
import { Toast } from "../../components/atoms";
import { HeroSection, ProductSection } from "../../components/organisms";
import { HomeTemplate } from "../../components/templates";
import type { Product } from "../../types";

const newProducts: Product[] = [
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
    category: "뷰티",
    image:
      "https://readdy.ai/api/search-image?query=green%20tea%20serum%20in%20transparent%20bottle%20on%20white%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product9&orientation=squarish",
  },
  {
    id: 12,
    brand: "COS",
    name: "오가닉 코튼 티셔츠",
    price: 29000,
    category: "상의",
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
    category: "뷰티",
    image:
      "https://readdy.ai/api/search-image?query=luxury%20moisturizing%20cream%20in%20elegant%20glass%20jar%20on%20clean%20white%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product8&orientation=squarish",
  },

  {
    id: 13,
    brand: "MANGO",
    name: "리넨 셔츠",
    price: 45000,
    category: "상의",
    image:
      "https://readdy.ai/api/search-image?query=light%20linen%20shirt%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product13&orientation=squarish",
  },
  {
    id: 14,
    brand: "CONVERSE",
    name: "척 테일러 올스타",
    price: 79000,
    category: "신발",
    image:
      "https://readdy.ai/api/search-image?query=classic%20white%20canvas%20sneakers%20on%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product14&orientation=squarish",
  },
  {
    id: 15,
    brand: "MULBERRY",
    name: "베이시스 백",
    price: 450000,
    category: "가방",
    image:
      "https://readdy.ai/api/search-image?query=luxury%20brown%20leather%20handbag%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product15&orientation=squarish",
  },
  {
    id: 16,
    brand: "SK-II",
    name: "페이셜 트리트먼트 에센스",
    price: 150000,
    category: "뷰티",
    image:
      "https://readdy.ai/api/search-image?query=luxury%20facial%20essence%20bottle%20on%20white%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product16&orientation=squarish",
  },
];

const bestProducts: Product[] = [
  {
    id: 4,
    brand: "UNIQLO",
    name: "히트텍 크루넥 긴팔티",
    price: 19900,
    category: "상의",
    image:
      "https://readdy.ai/api/search-image?query=black%20long%20sleeve%20t-shirt%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product4&orientation=squarish",
  },
  {
    id: 5,
    brand: "ADIDAS",
    name: "스탠 스미스 스니커즈",
    price: 109000,
    category: "신발",
    image:
      "https://readdy.ai/api/search-image?query=white%20leather%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product5&orientation=squarish",
  },
  {
    id: 6,
    brand: "ZARA",
    name: "미니 크로스백",
    price: 59000,
    category: "가방",
    image:
      "https://readdy.ai/api/search-image?query=small%20black%20leather%20crossbody%20bag%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product6&orientation=squarish",
  },
  {
    id: 7,
    brand: "H&M",
    name: "니트 원피스",
    price: 49000,
    category: "원피스/스커트",
    image:
      "https://readdy.ai/api/search-image?query=beige%20knit%20dress%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product7&orientation=squarish",
  },
  {
    id: 10,
    brand: "SULWHASOO",
    name: "윤조에센스",
    price: 120000,
    category: "뷰티",
    image:
      "https://readdy.ai/api/search-image?query=luxury%20golden%20essence%20bottle%20on%20marble%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product10&orientation=squarish",
  },
  {
    id: 11,
    brand: "MAC",
    name: "레트로 매트 립스틱",
    price: 32000,
    category: "뷰티",
    image:
      "https://readdy.ai/api/search-image?query=elegant%20red%20lipstick%20on%20black%20glossy%20surface%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product11&orientation=squarish",
  },
];

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = true; // 예시 데이터
  const userName = "김민수"; // 예시 데이터
  const cartCount = 3; // 예시 데이터
  const [selectedCategory, setSelectedCategory] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([
    1, // 예시로 몇 개의 제품 ID를 추가
    2,
    9,
    14,
    7,
  ]);
  const [showToast, setShowToast] = useState(false);

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
    <div>
      {showToast && <Toast message="찜 목록에 추가되었습니다" />}

      <HomeTemplate
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn}
        userName={userName}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      >
        <HeroSection />

        <ProductSection
          title="NEW ARRIVALS"
          products={newProducts}
          selectedCategory={selectedCategory}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          disableFiltering={true} // 필터링 비활성화
        />

        <ProductSection
          title="BEST PRODUCTS"
          products={bestProducts}
          selectedCategory={selectedCategory}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          disableFiltering={true} // 필터링 비활성화
        />
      </HomeTemplate>
    </div>
  );
};

export default Home;
