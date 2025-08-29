import { api } from "../lib/axios";
import type { ListProductsData, ListProductsParams } from "../types/products";

// 3) 목록 조회 함수
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
