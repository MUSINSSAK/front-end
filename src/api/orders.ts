import { api } from "../lib/axios";

export type OrderItemsApiData = {
  orderPk: number;
  orderId: number;
  orderNumber: string;
  status: string;
  reservationExpiresAt: string;
  totalProductAmount: number;
  discountAmount: number;
  deliveryFee: number;
  finalAmount: number;
  items: Array<{
    id: number;
    isDefault: boolean;
    // 추가 필드들이 백엔드에서 제공되면 여기에 추가
    cartItemId?: number;
    productId?: number;
    productName?: string;
    brandName?: string;
    size?: string;
    quantity?: number;
    salePrice?: number;
    originalPrice?: number;
    imageUrl?: string | null;
    thumbnailImageUrl?: string | null;
  }>;
  summary?: {
    originalTotal: number;
    cartDiscount: number;
    couponDiscount: number;
    pointsUsed: number;
    shippingFee: number;
    finalAmount: number;
  };
  remainingTimeSeconds?: number;
};

export async function getOrderItems(orderIdentifier: string | number) {
  let url: string;

  if (typeof orderIdentifier === "number") {
    // 숫자 orderPk인 경우 기존 API 사용
    url = `/orders/${orderIdentifier}/items`;
  } else {
    // 문자열 orderNumber인 경우 새로운 API 사용
    const trimmed = orderIdentifier.trim();
    if (!trimmed) {
      throw new Error("orderIdentifier is required");
    }
    url = `/orders/number/${trimmed}/items`;
  }

  const response = await api.get<{ data: OrderItemsApiData }>(url);
  return response.data.data;
}

type UpdateOrderInfoRequest = {
  deliveryInfo: {
    recipient: string;
    phone: string;
    address: string;
    detailAddress: string;
    postalCode?: string;
    deliveryRequest: string;
  };
  ordererInfo: {
    name: string;
    email: string;
    phone: string;
  };
};

export async function updateOrderInfo(
  orderIdentifier: string | number,
  data: UpdateOrderInfoRequest,
) {
  let resolved: string;

  if (typeof orderIdentifier === "number") {
    resolved = orderIdentifier.toString();
  } else {
    const trimmed = orderIdentifier.trim();

    // 백엔드가 Long 타입만 받으므로 문자열에서 숫자 부분 추출
    const match = trimmed.match(/\d+/);
    if (match) {
      resolved = match[0];
    } else {
      resolved = trimmed;
    }
  }

  if (!resolved) {
    throw new Error("orderIdentifier is required");
  }

  const response = await api.put(`/orders/${resolved}`, data);
  return response.data;
}
