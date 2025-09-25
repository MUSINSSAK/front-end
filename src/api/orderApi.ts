import { api } from "../lib/axios";
import type { OrderHistoryResponse } from "../types/order";

// [수정] period와 status의 타입을 더 구체적인 문자열 리터럴 유니언 타입으로 변경
type OrderHistoryPeriod = "1month" | "3months" | "6months" | "all";
type OrderHistoryStatus = "ALL" | "ORDERED" | "CANCELLED" | "RETURNED";

// getOrderHistory 함수에 전달할 파라미터의 타입
type GetOrderHistoryParams = {
  period: OrderHistoryPeriod;
  status: OrderHistoryStatus;
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
