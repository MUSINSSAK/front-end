import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { CATEGORIES } from "../../../constants/categories";
import { Breadcrumb } from "../../molecules";
import { SidebarFilters } from "../../organisms";
import styles from "./ShopTemplate.module.css";

type ShopTemplateProps = {
  children: React.ReactNode;
};

// 영어 라벨 → DB 한글명 매핑 (임시)
const BRAND_EN_TO_DB: Record<string, string> = {
  NIKE: "나이키",
  ADIDAS: "아디다스",
  Reebok: "리복",
  Vans: "반스",
  Umbro: "엄브로",
  Converse: "컨버스",
  Puma: "푸마",
  Hoka: "호카",
  SHOOPEN: "슈펜",
  ELCANTO: "엘칸토",
  MLB: "엠엘비",
};
// 역매핑: DB 한글명 → 영어 라벨 (임시)
const BRAND_DB_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(BRAND_EN_TO_DB).map(([en, ko]) => [ko, en]),
);

export default function ShopTemplate({ children }: ShopTemplateProps) {
  const { cat } = useParams<{ cat: string }>();
  const category = CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0];

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    category.name,
  ]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1) 최초 진입 시: URL → 상태 복원 (안전)
  useEffect(() => {
    // brand 복원 (URL은 한글, 내부 상태는 영어 라벨)
    const initialBrandsKo = searchParams.getAll("brand");
    if (initialBrandsKo.length) {
      const initialBrandsEn = initialBrandsKo.map(
        (ko) => BRAND_DB_TO_EN[ko] ?? ko,
      );
      setSelectedBrands(initialBrandsEn);
    }

    // price 복원
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    if (min || max) {
      setPriceRange([min ? Number(min) : 0, max ? Number(max) : 1000000]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 1회만

  // 2) 상태 → URL 동기화 (렌더 단계가 아닌 effect에서만 수행)
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // brand 재작성 (영→한 변환 후 URL에 기록)
    params.delete("brand");
    selectedBrands.forEach((en) => {
      const ko = BRAND_EN_TO_DB[en] ?? en;
      params.append("brand", ko);
    });

    // price 재작성
    const [min, max] = priceRange;
    if (min > 0) params.set("minPrice", String(min));
    else params.delete("minPrice");

    if (max < 1000000) params.set("maxPrice", String(max));
    else params.delete("maxPrice");

    // 필터 변경 시 커서 초기화
    params.delete("cursor");

    // 렌더 중이 아닌 effect에서만 라우터 상태 업데이트 → 경고 해결
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrands, priceRange]);

  // 3) 핸들러: 상태만 변경 (URL 갱신은 위 effect가 담당)
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  useEffect(() => {
    // 라우트 파라미터(:cat)가 바뀌면 사이드바 카테고리도 맞춰 갱신
    setSelectedCategories([category.name]);
  }, [category.name]);

  const handleCategoryToggle = (catName: string) => {
    const next = CATEGORIES.find((c) => c.name === catName);
    if (!next) return;

    // 현재 쿼리 유지하며 카테고리만 이동
    navigate(`/category/${next.id}?${searchParams.toString()}`);

    // UI 표시용 선택 상태
    setSelectedCategories([catName]);
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <div className={styles.wrapper}>
      <Breadcrumb path={[category.name]} />

      <div className={styles.contentWrapper}>
        <SidebarFilters
          brands={[
            "NIKE",
            "ADIDAS",
            "Reebok",
            "Vans",
            "Umbro",
            "Converse",
            "Puma",
            "Hoka",
            "SHOOPEN",
            "ELCANTO",
            "MLB",
          ]}
          categories={CATEGORIES.map((c) => c.name)}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategories}
          priceRange={priceRange}
          onBrandToggle={handleBrandToggle}
          onCategoryToggle={handleCategoryToggle}
          onPriceChange={handlePriceChange}
        />
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
