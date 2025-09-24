import { api } from "../lib/axios";

// 결제 정보 조회 API 응답 타입
export type PaymentInfoResponse = {
  orderPk: number;
  orderId: string;
  orderItems: Array<{
    id: number;
    productName: string;
    brandName: string;
    size: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  paymentSummary: {
    finalAmount: number;
  };
  deliveryInfo: {
    recipient: string;
    phone: string;
    address: string;
    detailAddress: string;
    deliveryRequest: string;
  };
  remainingTime: string;
};

// 결제 요청 API 응답 타입
export type PaymentRequestResponse = {
  paymentId: string;
  merchantId: string;
  channelKey: string; // V2 API용 추가
  orderName: string;
  totalAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  returnUrl: string;
  notificationUrl: string;
};

// 결제 정보 조회
export async function getPaymentInfo(
  orderId: string,
): Promise<PaymentInfoResponse> {
  const response = await api.get<{ data: PaymentInfoResponse }>(
    `/payments/${orderId}/info`,
  );
  return response.data.data;
}

// 결제 요청
export async function requestPayment(
  orderId: string,
): Promise<PaymentRequestResponse> {
  try {
    console.log("결제 요청 API 호출:", {
      orderId,
      url: `/payments/${orderId}/request`,
    });
    const response = await api.post<{ data: PaymentRequestResponse }>(
      `/payments/${orderId}/request`,
      {},
    );
    console.log("결제 요청 API 성공:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    const apiError = error as { response?: { status?: number; statusText?: string; data?: unknown }; message?: string };
    console.error("결제 요청 API 오류:", {
      orderId,
      status: apiError.response?.status,
      statusText: apiError.response?.statusText,
      data: apiError.response?.data,
      message: apiError.message,
    });
    throw error;
  }
}

// 결제 완료 API 타입
export type PaymentCompleteRequest = {
  transactionId: string;
  status: string;
};

export type PaymentCompleteResponse = {
  orderNumber: string;
  paymentId: string;
  transactionId: string;
  paymentStatus: string;
  completedAt: string;
  finalAmount: number;
};

// 결제 완료 알림
export async function completePayment(
  paymentId: string,
  data: PaymentCompleteRequest,
): Promise<PaymentCompleteResponse> {
  try {
    console.log("=== 백엔드 결제 완료 API 호출 시작 ===");
    console.log("결제 완료 API 호출:", {
      paymentId,
      url: `/payments/${paymentId}/complete`,
      data,
    });

    const response = await api.post<{ data: PaymentCompleteResponse }>(
      `/payments/${paymentId}/complete`,
      data,
    );

    console.log("✅ 백엔드 결제 완료 처리 성공:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    const apiError = error as { response?: { status?: number; statusText?: string; data?: unknown }; message?: string };
    console.error("❌ 백엔드 결제 완료 처리 실패:", {
      paymentId,
      status: apiError.response?.status,
      statusText: apiError.response?.statusText,
      data: apiError.response?.data,
      message: apiError.message,
    });
    throw error;
  }
}
