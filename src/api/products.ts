import { api } from "../lib/axios";
import type {
  ListProductsData,
  ListProductsParams,
  Product,
} from "../types/products";

// 메인 페이지 신상품 조회
export async function getNewProducts(): Promise<Product[]> {
  const res = await api.get("/products/main");
  return res.data.data.products as Product[];
}

// 메인 페이지 베스트 상품 조회
export async function getBestProducts(): Promise<Product[]> {
  const res = await api.get("/products/main"); // 주문 구현이후 수정
  return res.data.data.products as Product[];
}

// 목록 조회 함수
export async function listProducts(
  params: ListProductsParams,
): Promise<ListProductsData> {
  const res = await api.get("/products", {
    params,
    // brand 배열을 &brand=a&brand=b 로 직렬화
    paramsSerializer: {
      serialize: (p: Record<string, unknown>) => {
        const usp = new URLSearchParams();
        Object.entries(p).forEach(([k, v]) => {
          if (v === undefined || v === null || v === "") return;
          if (Array.isArray(v)) {
            v.forEach((item) => usp.append(k, String(item)));
          } else {
            usp.set(k, String(v));
          }
        });
        return usp.toString();
      },
    },
  });

  // 서버 공통 포맷: { status, code, message, data }
  return res.data.data as ListProductsData;
}
