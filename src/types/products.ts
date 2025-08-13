export type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  image: string;
};

// 2) 요청/응답 타입
export type ListProductsParams = {
  category: string; // 필수: 카테고리 슬러그 (e.g. 'shoes')
  brand?: string[]; // &brand=나이키&brand=반스
  minPrice?: number;
  maxPrice?: number;
  sort?: "recommend" | "popular" | "new" | "priceAsc" | "priceDesc";
  cursor?: number; // 이전 응답의 nextCursor
  size?: number; // 페이지 크기(기본 12)
};

export type ListProductsData = {
  products: Product[];
  nextCursor: number | null;
  hasNext: boolean;
};
