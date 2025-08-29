import type React from "react";
import { useEffect, useState } from "react";
import { getBestProducts, getNewProducts } from "../../api/mainProducts";
import { HeroSection, ProductSection } from "../../components/organisms";
import { useCategory } from "../../contexts/CategoryContext";
import type { Product } from "../../types/products";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const { selected } = useCategory();
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestProducts, setBestProducts] = useState<Product[]>([]); // (옵션)

  useEffect(() => {
    // 신상품 조회
    const fetchNewProducts = async () => {
      try {
        const products = await getNewProducts();
        setNewProducts(products);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "상품 목록 조회 실패";
        console.error("상품 목록 조회 실패:", errorMessage);
      }
    };

    // 베스트 상품 조회
    const fetchBestProducts = async () => {
      try {
        const products = await getBestProducts();
        setBestProducts(products);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "베스트 상품 조회 실패";
        console.error("베스트 상품 조회 실패:", errorMessage);
      }
    };

    fetchNewProducts();
    fetchBestProducts();
  }, []);

  return (
    <div className={styles.container}>
      <HeroSection />

      <ProductSection
        title="NEW ARRIVALS"
        products={newProducts}
        selectedCategory={selected}
        disableFiltering={true}
      />

      <ProductSection
        title="BEST PRODUCTS"
        products={bestProducts}
        selectedCategory={selected}
        disableFiltering={true}
      />
    </div>
  );
};

export default Home;
