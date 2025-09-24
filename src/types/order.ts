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
