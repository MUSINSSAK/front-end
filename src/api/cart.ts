import { api } from "../lib/axios";

// Cart API 응답 타입들
type CartItem = {
  cartItemId: number;
  productId: number;
  productName: string;
  brandName: string;
  productImageUrl: string;
  size: string;
  quantity: number;
  originalPrice: number;
  salePrice: number;
  discountRate: number;
  selected: boolean;
  stock: number;
};

type CartGetResponse = {
  userId: number;
  cartItems: CartItem[];
  selectedCount: number;
  totalProductAmount: number;
  totalCount: number;
  totalPrice: number;
  discountAmount: number;
  deliveryFee: number;
  finalAmount: number;
};

type CartChangeQuantityResponse = {
  cartItemId: number;
  oldQuantity: number;
  newQuantity: number;
  itemTotalPrice: number;
  availableStock: number;
  canIncrease: boolean;
  canDecrease: boolean;
};

type CartDeleteResponse = {
  deletedCount: number;
  remainingItems: number;
};

type CartSelectResponse = {
  selectedCount: number;
  selectedTotalPrice: number;
};

type ApiSuccessMessage = {
  message: string;
};

// 장바구니 조회
export async function getCart(): Promise<CartGetResponse> {
  const res = await api.get("/cart");
  return res.data.data as CartGetResponse;
}

// 장바구니에 상품 추가
export async function addToCart(
  productOptionId: number,
  quantity: number,
): Promise<ApiSuccessMessage> {
  const res = await api.post("/cart", { productOptionId, quantity });
  return { message: res.data.message };
}

// 장바구니 수량 변경
export async function changeCartQuantity(
  cartItemId: number,
  quantity: number,
): Promise<CartChangeQuantityResponse> {
  const res = await api.put(`/cart/${cartItemId}/quantity`, { quantity });
  return res.data.data as CartChangeQuantityResponse;
}

// 단일 장바구니 항목 삭제
export async function deleteCartItem(
  cartItemId: number,
): Promise<CartDeleteResponse> {
  const res = await api.delete(`/cart/items/${cartItemId}`);
  return res.data.data as CartDeleteResponse;
}

// 여러 장바구니 항목 삭제
export async function deleteCartSelected(
  cartItemIds: number[],
): Promise<CartDeleteResponse> {
  const res = await api.delete("/cart/items", { data: { cartItemIds } });
  return res.data.data as CartDeleteResponse;
}

// 장바구니 선택 상태 변경 (특정 항목들)
export async function selectCartItems(
  cartItemIds: number[],
  isSelected: boolean,
): Promise<CartSelectResponse> {
  const res = await api.put("/cart/select", { cartItemIds, isSelected });
  return res.data.data as CartSelectResponse;
}

// 장바구니 전체 선택/해제
export async function selectCartAll(
  isSelected: boolean,
): Promise<CartSelectResponse> {
  const res = await api.put("/cart/select", { selectAll: true, isSelected });
  return res.data.data as CartSelectResponse;
}

// 장바구니에서 주문 생성
export async function createOrderFromCart(cartItemIds: number[]) {
  const res = await api.post("/orders/create", { cartItemIds });
  return res.data.data;
}
