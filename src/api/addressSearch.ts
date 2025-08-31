import { api } from "../lib/axios";
import type { AddressSearchItemType } from "../types/address";

type AddressSearchResult = {
  items: AddressSearchItemType[];
};

// 주소 검색: GET /api/address/search?query=... (인증 헤더 없음)
export async function searchAddress(
  query: string,
): Promise<AddressSearchResult> {
  if (!query.trim()) throw new Error("EMPTY_QUERY");

  const res = await api.get("/address/search", {
    params: { query },
    // 주소검색은 공개 API: Authorization 없음
  });

  // 서버 공통 포맷 { status, code, message, data }
  const list: AddressSearchItemType[] = res.data?.data?.addresses ?? [];
  return { items: list };
}
