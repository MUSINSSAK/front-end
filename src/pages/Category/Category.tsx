import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { listProducts } from "../../api/products"; // API 호출 함수
import { ProductSection } from "../../components/organisms";
import { ShopTemplate } from "../../components/templates";
import { CATEGORIES } from "../../constants/categories";
import type { Product } from "../../types/products";

const Category: React.FC = () => {
  const { cat } = useParams<{ cat: string }>();
  const category = CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0];

  const [searchParams] = useSearchParams(); // ShopTemplate가 기록한 쿼리 읽기
  const brands = useMemo(() => searchParams.getAll("brand"), [searchParams]); // 쿼리 읽은 후에 &brand=... 반복 파라미터
  const brandsKey = brands.join("|");
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined; // [ADD]
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined; // [ADD]

  // 서버 데이터/상태
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 👇 무한 스크롤용 센티넬
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 첫 로드 & 카테고리 변경 시 조회
  // biome-ignore lint/correctness/useExhaustiveDependencies: <Infinite loop>
  useEffect(() => {
    let ignore = false;
    async function fetchFirst() {
      try {
        setLoading(true);
        setError(null);
        const data = await listProducts({
          category: category.id, // 백엔드 카테고리 슬러그
          size: 12,
          brand: brands.length ? brands : undefined, // 브랜드 필터 전파
          minPrice,
          maxPrice,
        });
        if (ignore) return;
        setProducts(data.products);
        setNextCursor(data.nextCursor);
        setHasNext(data.hasNext);
      } catch (error: unknown) {
        if (!ignore) {
          setError(`${error}`);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchFirst();
    return () => {
      ignore = true;
    };
  }, [category.id, brandsKey, minPrice, maxPrice, brands]); // 필터 변경 시 재조회

  // 다음 페이지 로드 (커서 기반)
  // biome-ignore lint/correctness/useExhaustiveDependencies: <Infinite loop>
  const loadMore = useCallback(async () => {
    if (!hasNext || loading) return;
    try {
      setLoading(true);
      const data = await listProducts({
        category: category.id,
        size: 12,
        cursor: nextCursor ?? undefined,
        brand: brands.length ? brands : undefined, // [ADD] 다음 페이지에도 동일 필터 전달
        minPrice, // [ADD]
        maxPrice, // [ADD]
      });
      setProducts((prev) => [...prev, ...data.products]);
      setNextCursor(data.nextCursor);
      setHasNext(data.hasNext);
    } catch (error: unknown) {
      setError(`${error}`);
    } finally {
      setLoading(false);
    }
  }, [
    category.id,
    hasNext,
    loading,
    nextCursor,
    brandsKey,
    minPrice,
    maxPrice,
  ]);

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNext) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading) {
          loadMore();
        }
      },
      {
        root: null, // 뷰포트 기준
        rootMargin: "200px", // 200px 남았을 때 미리 로드
        threshold: 0,
      },
    );

    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [hasNext, loading, loadMore]);

  return (
    <div>
      <ShopTemplate>
        <ProductSection
          title={category.name}
          numberOfProducts={true}
          products={products} // 서버에서 받은 목록
          selectedCategory={category.id}
          disableFiltering={true} // 서버에서 이미 카테고리 필터링했으니 중복 필터 X
        />
        <div ref={sentinelRef} style={{ height: 1 }} />
        {error && ( // ← 이 부분이 추가됨
          <div className="error-message">{error}</div>
        )}
      </ShopTemplate>
    </div>
  );
};

export default Category;
