import { api } from "../lib/axios";
import type { Address } from "../types/address";

/**
 * 배송지 목록 조회
 * GET /users/me/addresses
 * 서버 공통 포맷: { status, code, message, data }
 */
export async function getAddresses(): Promise<Address[]> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string;
  if (!accessToken) {
    throw new Error("VITE_ACCESS_TOKEN is missing in .env");
  }

  const res = await api.get("/users/me/addresses", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return res.data.data as Address[];
}

type UpdateAddressRequest = {
  label: string;
  recipient: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
};

/**
 * 배송지 수정
 * PUT /users/me/addresses/{addressId}
 * 서버 공통 포맷: { status, code, message, data|null }
 */
export async function updateAddress(
  addressId: number,
  payload: UpdateAddressRequest,
): Promise<void> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string;
  if (!accessToken) {
    throw new Error("VITE_ACCESS_TOKEN is missing in .env");
  }

  await api.put(`/users/me/addresses/${addressId}`, payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  // 백엔드 응답 data가 null이므로 별도 반환값 없음 → 목록은 프론트에서 재조회
}

// 신규 추가: 배송지 생성 요청 바디 (업데이트와 동일 스키마)
type CreateAddressRequest = {
  label: string;
  recipient: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  isDefault: boolean; // true면 생성과 동시에 기본 배송지 설정
};

/**
 * 배송지 추가
 * POST /users/me/addresses
 * 서버 공통 포맷: { status, code, message, data|null }
 */
export async function createAddress(
  payload: CreateAddressRequest,
): Promise<void> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string;
  if (!accessToken) {
    throw new Error("VITE_ACCESS_TOKEN is missing in .env");
  }

  await api.post("/users/me/addresses", payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  // 생성 후 목록은 프론트에서 재조회
}

/**
 * 배송지 삭제
 * DELETE /users/me/addresses/{addressId}
 * 서버 공통 포맷: { status, code, message, data|null }
 */
export async function deleteAddress(addressId: number): Promise<void> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string;
  if (!accessToken) {
    throw new Error("VITE_ACCESS_TOKEN is missing in .env");
  }

  await api.delete(`/users/me/addresses/${addressId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  // 삭제 후 목록은 프론트에서 재조회
}
