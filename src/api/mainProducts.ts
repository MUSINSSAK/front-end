import { api } from "../lib/axios";
import type { Product } from "../types/products";

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
