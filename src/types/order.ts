// ==============================
// 공통: 마이페이지 주문내역 (표시용)
// ==============================
export type Order = {
  date: string; // 예: "2025.08.25 13:05"
  orderNumber: string; // 예: "20250825-3F8C2A"
  products: { name: string; image: string; option: string; count: number }[];
  amount: string; // 예: "159,000원"
  status: string; // 예: "결제 완료"
  statusType: "success" | "processing" | "canceled" | "done";
};

// ==============================
// 장바구니 아이템 (Cart 전용)
// ==============================
export type OrderItemData = {
  id: number;
  brand: string;
  name: string;
  option: string; // 사이즈/색상 등 옵션 (Cart에서 사용)
  price: number; // 할인 적용 후 가격
  originalPrice: number; // 정가
  quantity: number;
  image: string;
  selected: boolean; // 체크박스 선택 여부
  stock: number;
};

// ==============================
// 주문/결제 아이템 (Order/Payment 공용)
// ==============================
export type OrderItem = {
  id: number;
  brand: string;
  name: string;
  size: string; // Cart.option → Order/Payment.size 로 매핑하여 사용
  price: number; // 실제 결제 기준 단가
  quantity: number;
  image: string;
};

// ==============================
// 페이지 간 state 스키마
// ==============================
export type CartToOrderState = {
  orderItems: OrderItem[]; // Cart에서 선택된 상품만 변환하여 전달
};

export type OrderToPaymentState = {
  orderItems: OrderItem[];
  appliedCouponDiscount: number;
  appliedPointsUsed: number;
  shippingFee: number;
  totalPay: number; // 최종 결제 금액
};

// Payment 페이지에서 useLocation().state로 받는 타입
export type PaymentState = OrderToPaymentState;

// ==============================
// 결제 관련 타입
// ==============================
export type PaymentMethod = "card" | "simple" | "transfer";
export type SimplePay = "" | "kakao" | "naver";

// ==============================
// 주문서(주문/결제 페이지) 폼 관련 타입
// ==============================
export type DeliveryInfo = {
  name: string; // 배송지명 (예: 집, 회사)
  recipient: string; // 수령인
  phone: string; // 연락처 (프론트에서 형식 체크)
  address: string; // 주소 (팝업/검색으로 선택)
  detailAddress: string; // 상세주소
  deliveryRequest: string; // 요청사항 (예: 직접 수령)
};

export type OrdererInfo = {
  name: string;
  email: string;
  phone: string;
  sameAsDelivery: boolean; // 배송지 정보와 동일 여부
};

// ==============================
// 쿠폰 타입 (Order 페이지에서 사용)
// ==============================
export type Coupon = {
  id: string;
  name: string;
  discountRate: number; // 퍼센트 할인(0 가능)
  discountAmount: number; // 정액 할인(0 가능)
  minOrderAmount: number; // 최소 주문 금액
  maxDiscountAmount: number; // 최대 할인 한도
  validUntil: string; // "YYYY-MM-DD"
  description: string;
};

// ==============================
// 타입 가드 (선택, 사용하면 안전)
// ==============================
export function isOrderItemsState(
  v: unknown,
): v is CartToOrderState | { orderItems: OrderItem[] } {
  return !!v && typeof v === "object" && Array.isArray((v as any).orderItems);
}

export function isPaymentState(v: unknown): v is PaymentState {
  if (!v || typeof v !== "object") return false;
  const s = v as any;
  return (
    Array.isArray(s.orderItems) &&
    typeof s.appliedCouponDiscount === "number" &&
    typeof s.appliedPointsUsed === "number" &&
    typeof s.shippingFee === "number" &&
    typeof s.totalPay === "number"
  );
}
