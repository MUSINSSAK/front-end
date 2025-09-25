import { api } from "../lib/axios";
import type {
  OrderHistoryItem,
  OrderHistoryPeriod,
  OrderHistoryStatus,
  Pagination,
} from "../types/order";

// GET /api/orders/me API의 전체 응답 타입
type OrderHistoryResponse = {
  orders: OrderHistoryItem[];
  pagination: Pagination;
};

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
