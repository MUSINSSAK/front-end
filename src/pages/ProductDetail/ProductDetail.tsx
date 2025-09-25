import { useState } from "react";
import { ImageGallery, TabNav } from "../../components/molecules";
import {
  ProductInfoPanel,
  ProductReview,
  QASection,
  ShippingReturnSection,
} from "../../components/organisms";
import { ProductDetailTemplate } from "../../components/templates";
import { useToast } from "../../contexts/ToastContext";
import type { Review } from "../../types/types";
import styles from "./ProductDetail.module.css";

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "상품정보" | "리뷰" | "문의" | "배송/환불"
  >("상품정보");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const productImages = [
    "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20side%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=600&height=600&seq=main1&orientation=squarish",
    "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20front%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=600&height=600&seq=main2&orientation=squarish",
    "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20back%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=600&height=600&seq=main3&orientation=squarish",
    "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20sole%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=600&height=600&seq=main4&orientation=squarish",
  ];

  const sizes = [
    "230",
    "235",
    "240",
    "245",
    "250",
    "255",
    "260",
    "265",
    "270",
    "275",
    "280",
  ];

  const [sortOption, setSortOption] = useState<"latest" | "highest" | "lowest">(
    "latest",
  );

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      product: { name: "에어맥스 270 스니커즈", image: "", date: "2024.01.15" },
      rating: 5,
      author: "김**",
      date: "2024.01.15",
      content:
        "정말 편하고 디자인도 예뻐요! 사이즈도 딱 맞고 쿠션감이 좋아서 하루 종일 신어도 발이 안 아파요.",
      images: [
        "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20side%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=600&height=600&seq=main1&orientation=squarish",
      ],
    },
    {
      id: 2,
      rating: 4,
      author: "이**",
      date: "2024.01.12",
      content: "색상이 화면에서 본 것보다 더 예뻐요. 배송도 빠르고 만족합니다.",
      images: [],
    },
    {
      id: 3,
      rating: 5,
      author: "박**",
      date: "2024.01.10",
      content:
        "에어맥스 시리즈 중에서 가장 편한 것 같아요. 운동할 때도 좋고 일상에서도 잘 어울려요.",
      images: [
        "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20front%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=600&height=600&seq=main2&orientation=squarish",
      ],
    },
  ]);

  const sortReviews = (option: "latest" | "highest" | "lowest") => {
    const sorted = [...reviews];
    switch (option) {
      case "latest":
        sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
    }
    setReviews(sorted);
    setReviews(sorted);
    setSortOption(option);
  };
  const toggleWishlist = () => setIsWishlisted((v) => !v);

  const { showToast } = useToast();

  const handleAddCart = (): void => {
    if (!selectedSize) {
      alert("사이즈를 선택해주세요.");
      return;
    }
    setCartCount((prev) => prev + quantity);
    showToast("장바구니에 상품이 추가되었습니다.");
  };

  return (
    <ProductDetailTemplate cartCount={cartCount} onAddCart={handleAddCart}>
      <section className={styles.productSection}>
        <ImageGallery
          images={productImages}
          current={currentImageIndex}
          onChange={setCurrentImageIndex}
          inWishlist={isWishlisted}
          onToggleWish={toggleWishlist}
        />

        <ProductInfoPanel
          brand="NIKE"
          title="에어맥스 270 스니커즈"
          rating={4.5}
          ratingCount={127}
          discountPercent={16}
          price={159000}
          originalPrice={189000}
          sizes={sizes}
          selectedSize={selectedSize}
          onChangeSize={setSelectedSize}
          qty={quantity}
          onChangeQty={setQuantity}
        />
      </section>

      <section className={styles.tabsSection}>
        <TabNav
          tabs={["상품정보", "리뷰", "문의", "배송/환불"]}
          active={activeTab}
          onChange={(t) =>
            setActiveTab(t as "상품정보" | "리뷰" | "문의" | "배송/환불")
          }
        />

        {activeTab === "상품정보" && (
          <div className={styles.prose}>
            <div>
              <h3 className={styles.blockTitle}>상품 상세 정보</h3>
              <p className={styles.para}>
                NIKE 에어맥스 270은 혁신적인 에어 쿠셔닝 시스템으로 최고의
                편안함을 제공합니다. 일상생활부터 가벼운 운동까지 다양한
                상황에서 착용할 수 있는 멀티 스니커즈입니다.
              </p>

              <h4 className={styles.blockTitle}>주요 특징</h4>
              <ul className={styles.listDisc}>
                <li>Max Air 유닛으로 뛰어난 쿠셔닝 제공</li>
                <li>통기성이 우수한 메시 소재 사용</li>
                <li>내구성 강화를 위한 고무 아웃솔</li>
                <li>세련된 디자인으로 다양한 스타일링 가능</li>
              </ul>

              <h4 className={styles.blockTitle}>소재 정보</h4>
              <ul className={styles.listDisc}>
                <li>갑피: 합성피혁, 메시</li>
                <li>안감: 텍스타일</li>
                <li>밑창: 고무</li>
              </ul>
            </div>

            <div className={styles.mutedPanel}>
              <h4 className={styles.blockTitle}>관리 방법</h4>
              <ul className={styles.mutedList}>
                <li>• 부드러운 브러시로 먼지 제거</li>
                <li>• 미지근한 물과 중성세제로 부분 세척</li>
                <li>• 직사광선을 피해 그늘에서 건조</li>
                <li>• 세탁기 사용 금지</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "리뷰" && (
          <ProductReview
            reviews={reviews}
            sortOption={sortOption}
            onSortChange={(opt: string) =>
              sortReviews(opt as "latest" | "highest" | "lowest")
            }
          />
        )}

        {activeTab === "문의" && (
          <QASection
            list={[
              {
                id: "q1",
                status: "답변완료",
                author: "고객",
                date: "2024.01.20",
                question: "사이즈가 어떻게 되나요?",
                answer: {
                  date: "2024.01.21",
                  content: "정사이즈로 나왔습니다.",
                },
              },
              {
                id: "q2",
                status: "답변대기",
                author: "고객",
                date: "2024.01.18",
                question: "화이트 색상 재입고 예정 있나요?",
              },
            ]}
          />
        )}

        {activeTab === "배송/환불" && <ShippingReturnSection />}
      </section>
    </ProductDetailTemplate>
  );
};

export default ProductDetail;
