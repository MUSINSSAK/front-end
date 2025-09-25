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

export type ProductSize = {
  size: string;
  stock: number;
};

type ProductMaterials = {
  upper: string[];
  lining: string[];
  outsole: string[]; // 스크린샷 키에 맞춤
};

export type ProductDetail = {
  productId: number;
  brandName: string;
  productName: string;
  images: string[];
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  rating: number;
  reviewCount: number;
  sizes: ProductSize[];
  description: string | null;
  features: string[];
  materials: ProductMaterials;
  care: string[];
};

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
