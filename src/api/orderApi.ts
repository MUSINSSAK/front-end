import { api } from "../lib/axios";
import type { OrderHistoryResponse } from "../types/order";

// getOrderHistory 함수에 전달할 파라미터의 타입
type GetOrderHistoryParams = {
  period: string; // "1month", "3months", "6months", "all"
  status: string; // "ALL", "ORDERED", "CANCELLED", "RETURNED"
  page: number;
  size: number;
};

// 내 주문 내역 목록을 조회하는 API 함수
export const getOrderHistory = async (
  params: GetOrderHistoryParams,
): Promise<OrderHistoryResponse> => {
  const response = await api.get("/orders/me", { params });
  return response.data.data;
};
