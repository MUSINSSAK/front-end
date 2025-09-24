import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { OrderItemsApiData } from "../../api/orders";
import { getOrderItems, updateOrderInfo } from "../../api/orders";
import {
  DeliveryInfoSection,
  DiscountSection,
  OrdererInfoSection,
  OrderFixedBar,
  OrderHeader,
  OrderItemsSection,
  OrderSummarySection,
} from "../../components/organisms";
import { OrderTemplate } from "../../components/templates";
import type {
  CartToOrderState,
  Coupon,
  OrderItem,
  OrderItemData,
  OrderToPaymentState,
} from "../../types/order";

const MIN_POINT_USE = 2000;
const DELIVERY_REQUEST_OPTIONS = [
  "직접 입력",
  "문 앞에 놓아주세요",
  "부재 시 경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "배송 전 연락 부탁드립니다",
];

const formatCurrency = (value: number) =>
  `${Math.max(0, value).toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원`;

function restoreUserEmail(): string {
  const keys = ["musinssak_user_email", "logged_in_email", "user_email"];
  for (const key of keys) {
    try {
      const value = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (value) return value;
    } catch {}
  }
  return "";
}

function isOrderItemsState(value: unknown): value is CartToOrderState {
  if (!value || typeof value !== "object") return false;
  const maybe = value as { orderItems?: unknown };
  return Array.isArray(maybe.orderItems);
}

function mapCartDataToOrderItems(items: OrderItemData[]): OrderItem[] {
  return items
    .filter((item) => item.selected)
    .map((item) => ({
      id: item.id,
      brand: item.brand,
      name: item.name,
      size: item.option,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));
}

function isOrderItemData(value: unknown): value is OrderItemData {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<OrderItemData>;
  return (
    typeof item.id === "number" &&
    typeof item.brand === "string" &&
    typeof item.name === "string" &&
    typeof item.option === "string" &&
    typeof item.price === "number" &&
    typeof item.originalPrice === "number" &&
    typeof item.quantity === "number" &&
    typeof item.image === "string" &&
    typeof item.selected === "boolean"
  );
}

const isOrderItemDataArray = (value: unknown): value is OrderItemData[] =>
  Array.isArray(value) && value.every(isOrderItemData);

function isOrderItem(value: unknown): value is OrderItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<OrderItem>;
  return (
    typeof item.id === "number" &&
    typeof item.brand === "string" &&
    typeof item.name === "string" &&
    typeof item.size === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number" &&
    typeof item.image === "string"
  );
}

const isOrderItemArray = (value: unknown): value is OrderItem[] =>
  Array.isArray(value) && value.every(isOrderItem);

function parseOrderPk(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (/^\d+$/.test(trimmed)) {
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

type OrderMeta = {
  orderId?: string;
  orderPk?: number;
};

function restoreOrderMeta(locationState: unknown): OrderMeta {
  if (locationState && typeof locationState === "object") {
    const maybe = locationState as Record<string, unknown>;
    const orderId =
      typeof maybe.orderId === "string" ? maybe.orderId : undefined;
    const orderPk = parseOrderPk(maybe.orderPk);
    if (orderId || typeof orderPk === "number") {
      return { orderId, orderPk };
    }
  }
  try {
    const raw = sessionStorage.getItem("musinssak_recent_order");
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const orderId =
        typeof parsed?.orderId === "string"
          ? (parsed.orderId as string)
          : undefined;
      const orderPk = parseOrderPk(parsed?.orderPk);
      if (orderId || typeof orderPk === "number") {
        return { orderId, orderPk };
      }
    }
  } catch {}
  return {};
}

function restoreOrderItemsFromAnyState(locationState: unknown): OrderItem[] {
  if (isOrderItemsState(locationState) && locationState.orderItems.length) {
    return locationState.orderItems;
  }

  try {
    const raw = sessionStorage.getItem("musinssak_cart_selected");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isOrderItemDataArray(parsed)) {
        return mapCartDataToOrderItems(parsed);
      }
      if (isOrderItemArray(parsed)) {
        return parsed;
      }
    }
  } catch {}

  try {
    const raw = localStorage.getItem("musinssak_cart_selected");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isOrderItemDataArray(parsed)) {
        return mapCartDataToOrderItems(parsed);
      }
      if (isOrderItemArray(parsed)) {
        return parsed;
      }
    }
  } catch {}

  return [
    {
      id: 1,
      brand: "NIKE",
      name: "에어맥스 270 화이트 스니커즈",
      size: "250",
      price: 159000,
      quantity: 1,
      image:
        "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20side%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=order1&orientation=squarish",
    },
    {
      id: 2,
      brand: "ADIDAS",
      name: "스탠 스미스 화이트 스니커즈",
      size: "245",
      price: 109000,
      quantity: 2,
      image:
        "https://readdy.ai/api/search-image?query=white%20leather%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=order2&orientation=squarish",
    },
  ];
}

function restoreCartSummary(): {
  originalTotal: number;
  discountTotal: number;
  productPaid: number;
} | null {
  try {
    const raw =
      sessionStorage.getItem("musinssak_cart_summary") ||
      localStorage.getItem("musinssak_cart_summary");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.originalTotal === "number" &&
      typeof parsed.discountTotal === "number" &&
      typeof parsed.productPaid === "number"
    ) {
      return parsed;
    }
  } catch {}
  return null;
}

function restoreOriginalTotalFromStorage(
  orderItems: OrderItem[],
): number | null {
  try {
    const raw =
      sessionStorage.getItem("musinssak_cart_selected") ||
      localStorage.getItem("musinssak_cart_selected");
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!isOrderItemDataArray(arr) || arr.length === 0) return null;

    const byId = new Map<number, OrderItemData>();
    arr
      .filter((item) => item.selected)
      .forEach((item) => byId.set(item.id, item));
    return orderItems.reduce((sum, item) => {
      const source = byId.get(item.id);
      if (!source) return sum;
      return sum + Number(source.originalPrice) * Number(item.quantity);
    }, 0);
  } catch {}
  return null;
}

function computeCartDiscountFromStorage(orderItems: OrderItem[]): number {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem("musinssak_cart_selected");
  } catch {}
  if (!raw) {
    try {
      raw = localStorage.getItem("musinssak_cart_selected");
    } catch {}
  }
  if (!raw) return 0;

  try {
    const arr = JSON.parse(raw);
    if (!isOrderItemDataArray(arr) || arr.length === 0) return 0;

    const byId = new Map<number, OrderItemData>();
    arr
      .filter((item) => item.selected)
      .forEach((item) => byId.set(item.id, item));

    let sum = 0;
    for (const item of orderItems) {
      const source = byId.get(item.id);
      if (!source) continue;
      const discount = (source.originalPrice - source.price) * item.quantity;
      if (discount > 0) sum += discount;
    }
    return Math.max(0, sum);
  } catch {
    return 0;
  }
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    id: "coupon1",
    name: "웰컴 신규 10% 할인 쿠폰",
    discountRate: 10,
    discountAmount: 0,
    minOrderAmount: 30000,
    maxDiscountAmount: 10000,
    validUntil: "2025-08-19",
    description: "웰컴 회원 대상 할인 혜택입니다.",
  },
  {
    id: "coupon2",
    name: "주말 한정 15% 할인 쿠폰",
    discountRate: 15,
    discountAmount: 0,
    minOrderAmount: 50000,
    maxDiscountAmount: 15000,
    validUntil: "2025-08-31",
    description: "주말 동안 특정 상품 할인 혜택입니다.",
  },
  {
    id: "coupon3",
    name: "첫 주문 5,000원 할인 쿠폰",
    discountRate: 0,
    discountAmount: 5000,
    minOrderAmount: 20000,
    maxDiscountAmount: 5000,
    validUntil: "2025-12-31",
    description: "첫 주문 고객 전용 정액 할인 쿠폰입니다.",
  },
];

const Order = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: unknown };

  const orderMeta = useMemo(() => restoreOrderMeta(state), [state]);
  const fallbackOrderItems = useMemo(
    () => restoreOrderItemsFromAnyState(state),
    [state],
  );

  const [orderId, setOrderId] = useState<string | undefined>(orderMeta.orderId);
  const [orderPk, setOrderPk] = useState<number | undefined>(orderMeta.orderPk);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(fallbackOrderItems);
  const [serverSummary, setServerSummary] = useState<
    OrderItemsApiData["summary"] | null
  >(null);
  const [initialSummaryApplied, setInitialSummaryApplied] = useState(false);
  const [loadingOrderItems, setLoadingOrderItems] = useState(false);
  const [orderItemsError, setOrderItemsError] = useState<string | null>(null);

  const resolvedOrderPk = useMemo(() => parseOrderPk(orderPk), [orderPk]);
  const cartSummary = restoreCartSummary();

  const cartDiscount = useMemo(() => {
    if (serverSummary) return serverSummary.cartDiscount;
    return cartSummary
      ? Math.max(0, cartSummary.discountTotal)
      : computeCartDiscountFromStorage(orderItems);
  }, [orderItems, cartSummary, serverSummary]);

  const originalTotalForDisplay = useMemo(() => {
    if (serverSummary) return serverSummary.originalTotal;
    if (cartSummary) return cartSummary.originalTotal;
    const restored = restoreOriginalTotalFromStorage(orderItems);
    if (typeof restored === "number") return restored;
    const discountedSum = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return discountedSum + cartDiscount;
  }, [orderItems, cartSummary, cartDiscount, serverSummary]);

  const baseAmount = Math.max(0, originalTotalForDisplay - cartDiscount);
  useEffect(() => {
    if (!orderId && typeof resolvedOrderPk !== "number") return;
    try {
      sessionStorage.setItem(
        "musinssak_recent_order",
        JSON.stringify({
          orderId: orderId ?? null,
          orderPk: resolvedOrderPk ?? null,
        }),
      );
    } catch {}
  }, [orderId, resolvedOrderPk]);

  useEffect(() => {
    // orderPk 또는 orderId가 있을 때 주문 정보 로드
    const fetchKey = orderPk || orderId;
    if (!fetchKey) return;
    let ignore = false;
    setLoadingOrderItems(true);
    setOrderItemsError(null);

    getOrderItems(fetchKey)
      .then((data) => {
        if (ignore) return;
        const mappedItems = data.items.map((item, index) => {
          console.log("Order API 응답 - 상품 정보:", {
            id: item.id,
            isDefault: item.isDefault,
            productName: item.productName,
            imageUrl: item.imageUrl,
            hasDetailedInfo: !!(item.productName && item.brandName),
          });

          // 현재 API 응답에 상세 정보가 없으므로 fallback 데이터 사용
          return {
            id: item.id ?? item.cartItemId ?? item.productId ?? index,
            brand: item.brandName ?? "브랜드명 없음",
            name: item.productName ?? `상품 ${item.id}`,
            size: item.size ?? "사이즈 정보 없음",
            price: item.salePrice ?? item.originalPrice ?? 0,
            quantity: item.quantity ?? 1,
            image:
              item.imageUrl ??
              item.thumbnailImageUrl ??
              `https://readdy.ai/api/search-image?query=product%20${item.id}&width=80&height=80&seq=order${index}&orientation=squarish`,
          };
        });
        setOrderItems(mappedItems);
        setInitialSummaryApplied(false);

        // 현재 API 응답 구조에 맞춰 summary 생성
        const summary = data.summary ?? {
          originalTotal: data.totalProductAmount,
          cartDiscount: data.discountAmount,
          couponDiscount: 0,
          pointsUsed: 0,
          shippingFee: data.deliveryFee,
          finalAmount: data.finalAmount,
        };
        setServerSummary(summary);
        if (typeof data.orderPk === "number") {
          setOrderPk(data.orderPk);
        }
        if (data.orderNumber) {
          setOrderId(data.orderNumber);
        }
      })
      .catch((error: unknown) => {
        if (ignore) return;
        const response = (
          error as { response?: { status?: number; data?: { code?: string } } }
        ).response;
        const status = response?.status;
        const code = response?.data?.code;
        if (status === 400 && code === "ORDER_TIME_EXPIRED") {
          setOrderItemsError(
            "주문 가능 시간이 만료되었습니다. 장바구니에서 다시 진행해주세요.",
          );
        } else if (status === 403) {
          setOrderItemsError("해당 주문에 접근할 권한이 없습니다.");
        } else {
          setOrderItemsError(
            "주문 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoadingOrderItems(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [orderPk, orderId]);

  useEffect(() => {
    if (!serverSummary || initialSummaryApplied) return;
    setCouponDiscount(serverSummary.couponDiscount);
    setPointsUsed(serverSummary.pointsUsed);
    setInitialSummaryApplied(true);
  }, [serverSummary, initialSummaryApplied]);

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    recipient: "",
    phone: "",
    address: "",
    detailAddress: "",
    deliveryRequest: DELIVERY_REQUEST_OPTIONS[0],
  });

  const [ordererInfo, setOrdererInfo] = useState({
    name: "",
    email: restoreUserEmail(),
    phone: "",
    sameAsDelivery: false,
  });

  const toggleSameAsDelivery = () => {
    const next = !ordererInfo.sameAsDelivery;
    setOrdererInfo((prev) => ({
      ...prev,
      sameAsDelivery: next,
      name: next ? deliveryInfo.recipient : prev.name,
      phone: next ? deliveryInfo.phone : prev.phone,
      email: prev.email || restoreUserEmail(),
    }));
  };

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: number; address: string; detail: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAddressSearch = async () => {
    if (!searchKeyword.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const results = searchKeyword.includes("서울")
        ? [
            {
              id: 1,
              address: "서울특별시 성동구 성수이로 152",
              detail: "(성수동 트리마제)",
            },
            {
              id: 2,
              address: "서울특별시 성동구 성수이로 129",
              detail: "(성수동 우림라이온스밸리)",
            },
            {
              id: 3,
              address: "서울특별시 성동구 아차산로 142",
              detail: "(성수동 L타워)",
            },
          ]
        : [];
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSelect = (address: string) => {
    setDeliveryInfo((prev) => ({ ...prev, address }));
    setIsAddressModalOpen(false);
    setSearchKeyword("");
    setHasSearched(false);
    setSearchResults([]);
  };

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [availablePoints] = useState(5000);

  const applyCouponById = (id: string | "") => {
    setSelectedCoupon(id);
    if (!id) {
      setCouponDiscount(0);
      return;
    }
    const coupon = AVAILABLE_COUPONS.find((item) => item.id === id);
    if (!coupon) {
      setCouponDiscount(0);
      return;
    }
    if (baseAmount < coupon.minOrderAmount) {
      setCouponDiscount(0);
      return;
    }
    const rawDiscount =
      coupon.discountAmount > 0
        ? coupon.discountAmount
        : Math.floor((baseAmount * coupon.discountRate) / 100);
    setCouponDiscount(Math.min(rawDiscount, coupon.maxDiscountAmount));
  };

  const clampPoints = (value: number) => {
    const safe = Math.max(0, Math.min(value, availablePoints));
    setPointsUsed(safe);
  };

  const shippingFee =
    serverSummary?.shippingFee ??
    (baseAmount >= 50000 ? 0 : baseAmount > 0 ? 3000 : 0);
  const finalAmount = Math.max(
    0,
    baseAmount + shippingFee - couponDiscount - pointsUsed,
  );

  const isEmailValid =
    !!ordererInfo.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(ordererInfo.email));

  const meetsPointRule = pointsUsed === 0 || pointsUsed >= MIN_POINT_USE;

  const isFormValid =
    !!deliveryInfo.recipient &&
    !!deliveryInfo.phone &&
    !!deliveryInfo.address &&
    !!ordererInfo.name &&
    isEmailValid &&
    !!ordererInfo.phone &&
    meetsPointRule;

  const handleProceedPayment = async () => {
    if (!isFormValid) return;

    try {
      // DB에 주문자/배송지 정보 저장
      // 백엔드가 Long 타입만 받을 수 있으므로 orderPk만 사용
      if (typeof orderPk === "number") {
        console.log("주문 정보 저장 중...", {
          orderPk,
          deliveryInfo,
          ordererInfo,
        });
        await updateOrderInfo(orderPk, {
          deliveryInfo: {
            recipient: deliveryInfo.recipient,
            phone: deliveryInfo.phone,
            address: deliveryInfo.address,
            detailAddress: deliveryInfo.detailAddress,
            deliveryRequest: deliveryInfo.deliveryRequest,
          },
          ordererInfo: {
            name: ordererInfo.name,
            email: ordererInfo.email,
            phone: ordererInfo.phone,
          },
        });
        console.log("주문 정보 저장 완료");
      } else {
        console.warn("orderPk가 없어서 주문 정보를 저장하지 않음", {
          orderPk,
          orderId,
        });
      }

      // 결제 페이지로 이동
      const stateForPayment: OrderToPaymentState = {
        orderItems,
        appliedCouponDiscount: couponDiscount,
        appliedPointsUsed: pointsUsed,
        shippingFee,
        totalPay: finalAmount,
      };

      try {
        sessionStorage.setItem(
          "musinssak_order_state",
          JSON.stringify(stateForPayment),
        );
      } catch {}

      navigate("/payment", { state: stateForPayment });
    } catch (error: unknown) {
      const response = (
        error as { response?: { status?: number; data?: { code?: string } } }
      ).response;
      const status = response?.status;
      const code = response?.data?.code;

      if (status === 400 && code === "ORDER_TIME_EXPIRED") {
        alert(
          "주문 가능 시간이 만료되었습니다. 장바구니에서 다시 진행해주세요.",
        );
      } else if (status === 403) {
        alert("해당 주문에 접근할 권한이 없습니다.");
      } else if (status === 404) {
        alert("주문을 찾을 수 없습니다.");
      } else {
        alert("주문 정보 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
      console.error("주문 정보 저장 실패:", error);
    }
  };

  const ids = {
    deliveryName: "delivery-name",
    recipient: "delivery-recipient",
    deliveryPhone: "delivery-phone",
    deliveryAddress: "delivery-address",
    deliveryDetail: "delivery-detail",
    deliveryRequest: "delivery-request",
    ordererName: "orderer-name",
    ordererEmail: "orderer-email",
    ordererPhone: "orderer-phone",
    couponSelect: "coupon-select",
    pointInput: "point-input",
    searchInput: "address-search",
  } as const;

  return (
    <OrderTemplate
      header={
        <OrderHeader title="주문/결제" onBack={() => window.history.back()} />
      }
      footer={
        <OrderFixedBar
          itemCount={orderItems.length}
          finalAmount={finalAmount}
          disabled={!isFormValid}
          onSubmit={handleProceedPayment}
          formatCurrency={formatCurrency}
        />
      }
    >
      <OrderItemsSection
        items={orderItems}
        formatCurrency={formatCurrency}
        defaultOpen={false}
        loading={loadingOrderItems}
        errorMessage={orderItemsError}
      />

      <DeliveryInfoSection
        info={deliveryInfo}
        onChange={(field, value) =>
          setDeliveryInfo((prev) => ({ ...prev, [field]: value }))
        }
        requestOptions={DELIVERY_REQUEST_OPTIONS}
        ids={{
          name: ids.deliveryName,
          recipient: ids.recipient,
          phone: ids.deliveryPhone,
          address: ids.deliveryAddress,
          detail: ids.deliveryDetail,
          request: ids.deliveryRequest,
        }}
        addressModal={{
          isOpen: isAddressModalOpen,
          keyword: searchKeyword,
          results: searchResults,
          isSearching,
          hasSearched,
          onKeywordChange: setSearchKeyword,
          onSearch: handleAddressSearch,
          onSelect: handleAddressSelect,
          onClose: () => {
            setIsAddressModalOpen(false);
            setIsSearching(false);
          },
          onOpen: () => {
            setIsAddressModalOpen(true);
            setHasSearched(false);
            setSearchResults([]);
          },
          searchInputId: ids.searchInput,
        }}
      />

      <OrdererInfoSection
        info={ordererInfo}
        onChange={(field, value) =>
          setOrdererInfo((prev) => ({ ...prev, [field]: value }))
        }
        onToggleSameAsDelivery={toggleSameAsDelivery}
        ids={{
          name: ids.ordererName,
          email: ids.ordererEmail,
          phone: ids.ordererPhone,
        }}
      />

      <DiscountSection
        ids={{
          couponSelect: ids.couponSelect,
          pointInput: ids.pointInput,
        }}
        coupons={AVAILABLE_COUPONS}
        selectedCouponId={selectedCoupon}
        onSelectCoupon={setSelectedCoupon}
        onApplyCoupon={applyCouponById}
        onOpenCouponModal={() => setIsCouponModalOpen(true)}
        couponModal={{
          isOpen: isCouponModalOpen,
          onClose: () => setIsCouponModalOpen(false),
        }}
        pointsUsed={pointsUsed}
        onChangePoints={(value) => {
          if (value !== 0 && value < MIN_POINT_USE) {
            setPointsUsed(0);
          } else {
            clampPoints(value);
          }
        }}
        onApplyAllPoints={() => clampPoints(availablePoints)}
        availablePoints={availablePoints}
        minPointUse={MIN_POINT_USE}
        formatCurrency={formatCurrency}
      />

      <OrderSummarySection
        originalTotal={originalTotalForDisplay}
        cartDiscount={cartDiscount}
        couponDiscount={couponDiscount}
        pointsUsed={pointsUsed}
        shippingFee={shippingFee}
        finalAmount={finalAmount}
        formatCurrency={formatCurrency}
      />
    </OrderTemplate>
  );
};

export default Order;
