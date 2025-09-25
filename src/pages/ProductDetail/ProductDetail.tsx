import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductDetail } from "../../api/products";
import { ImageGallery, TabNav } from "../../components/molecules";
import {
  ProductInfoPanel,
  ProductReview,
  QASection,
  ShippingReturnSection,
} from "../../components/organisms";
import { ProductDetailTemplate } from "../../components/templates";
import { useToast } from "../../contexts/ToastContext";
import type {
  ProductDetail as ProductDetailType,
  ProductSize,
} from "../../types/products";
import type { WrittenReview } from "../../types/review";
import styles from "./ProductDetail.module.css";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "상품정보" | "리뷰" | "문의" | "배송/환불"
  >("상품정보");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // API: 상세 조회
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getProductDetail(Number(id));
        setProduct(data);

        // 초깃값: 첫 번째 사이즈 선택(있다면)
        if (data.sizes?.length) {
          setSelectedSize(data.sizes[0].size);
        }
      } catch {
        setError("상품 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 파생 데이터
  const productImages = useMemo(() => product?.images ?? [], [product]);
  const sizeOptions = useMemo(
    () => (product?.sizes ? product.sizes.map((s: ProductSize) => s.size) : []),
    [product],
  );

  const { showToast } = useToast();

  const handleAddCart = (): void => {
    if (!selectedSize) {
      alert("사이즈를 선택해주세요.");
      return;
    }
    setCartCount((prev) => prev + quantity);
    showToast("장바구니에 상품이 추가되었습니다.");
  };

  const toggleWishlist = () => setIsWishlisted((v) => !v);

  // 더미 리뷰(기존 코드 유지)
  const [sortOption, setSortOption] = useState<"latest" | "highest" | "lowest">(
    "latest",
  );
  const [reviews, setReviews] = useState<WrittenReview[]>([
    // ... 기존 더미 리뷰들
  ]);
  const sortReviews = (option: "latest" | "highest" | "lowest") => {
    const sorted = [...reviews];
    switch (option) {
      case "latest":
        sorted.sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime(),
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
    setSortOption(option);
  };

  if (loading) return <div className={styles.center}>로딩중…</div>;
  if (error || !product)
    return (
      <div className={styles.center}>{error ?? "상품을 찾을 수 없어요."}</div>
    );

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
          brand={product.brandName}
          title={product.productName}
          rating={product.rating}
          ratingCount={product.reviewCount}
          discountPercent={product.discountRate}
          price={product.discountedPrice}
          originalPrice={product.originalPrice}
          sizes={sizeOptions}
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
              {product.description ? (
                <p className={styles.para}>{product.description}</p>
              ) : (
                <p className={styles.para}>상세 설명이 준비 중입니다.</p>
              )}

              {!!product.features?.length && (
                <>
                  <h4 className={styles.blockTitle}>주요 특징</h4>
                  <ul className={styles.listDisc}>
                    {product.features.map((f: string) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </>
              )}

              {!!product.materials && (
                <>
                  <h4 className={styles.blockTitle}>소재 정보</h4>
                  <ul className={styles.listDisc}>
                    {!!product.materials.upper?.length && (
                      <li>갑피: {product.materials.upper.join(", ")}</li>
                    )}
                    {!!product.materials.lining?.length && (
                      <li>안감: {product.materials.lining.join(", ")}</li>
                    )}
                    {!!product.materials.outsole?.length && (
                      <li>밑창: {product.materials.outsole.join(", ")}</li>
                    )}
                  </ul>
                </>
              )}
            </div>

            {!!product.care?.length && (
              <div className={styles.mutedPanel}>
                <h4 className={styles.blockTitle}>관리 방법</h4>
                <ul className={styles.mutedList}>
                  {product.care.map((c: string) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
            )}
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
        {activeTab === "배송/환불" && <ShippingReturnSection />}{" "}
      </section>
    </ProductDetailTemplate>
  );
};

export default ProductDetail;
