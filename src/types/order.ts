export type OrderItemData = {
  id: number;
  brand: string;
  name: string;
  option: string; // 사이즈
  price: number; // 판매가
  originalPrice: number; // 원가
  quantity: number;
  image: string;
  selected: boolean;
  stock: number;
};

export type OrderItem = {
  id: number;
  brand: string;
  name: string;
  size: string; // Cart의 option
  price: number; // 판매가
  quantity: number;
  image: string;
};

export type Coupon = {
  id: string;
  name: string;
  discountRate: number; // 0이면 정액
  discountAmount: number; // 0이면 정율
  minOrderAmount: number;
  maxDiscountAmount: number;
  validUntil: string; // YYYY-MM-DD
  description: string;
};

export type CartToOrderState = {
  orderItems: OrderItem[];
};

export type OrderToPaymentState = {
  orderItems: OrderItem[];
  appliedCouponDiscount: number;
  appliedPointsUsed: number;
  shippingFee: number;
  totalPay: number;
};

export type PaymentState = OrderToPaymentState;

// 주문 내역에 포함된 개별 상품 아이템의 타입
export type OrderHistoryItemDetail = {
  name: string;
  option: string;
  thumbnailUrl: string;
};

// 주문 내역 한 줄(카드)의 타입
export type OrderHistoryItem = {
  orderDate: string;
  orderNumber: string;
  items: OrderHistoryItemDetail[];
  totalAmount: number;
  orderStatus: string;
};

// 페이지네이션 정보 타입
export type Pagination = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

// GET /api/orders/me API의 전체 응답 타입
export type OrderHistoryResponse = {
  orders: OrderHistoryItem[];
  pagination: Pagination;
};

export type OrderHistoryPeriod = "1month" | "3months" | "6months" | "all";
export type OrderHistoryStatus = "ALL" | "ORDERED" | "CANCELLED" | "RETURNED";
