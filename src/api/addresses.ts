import { api } from "../lib/axios";
import type { Address } from "../types/address";

// 배송지 목록 조회

export async function getAddresses(): Promise<Address[]> {
  const res = await api.get("/users/me/addresses");
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

// 배송지 수정

export async function updateAddress(
  addressId: number,
  payload: UpdateAddressRequest,
): Promise<void> {
  await api.put(`/users/me/addresses/${addressId}`, payload);
}

type CreateAddressRequest = {
  label: string;
  recipient: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
};

// 배송지 추가

export async function createAddress(
  payload: CreateAddressRequest,
): Promise<void> {
  await api.post("/users/me/addresses", payload);
}

// 배송지 삭제

export async function deleteAddress(addressId: number): Promise<void> {
  await api.delete(`/users/me/addresses/${addressId}`);
}
