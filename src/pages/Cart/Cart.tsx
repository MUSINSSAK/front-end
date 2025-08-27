import { ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState, OrderSummary } from "../../components/molecules";
import { CartList } from "../../components/organisms";
import { CartTemplate } from "../../components/templates";
import type { OrderItemData } from "../../types/order";

const SS_KEY = "musinssak_cart_selected";
const CART_SUMMARY_SS = "musinssak_cart_summary";

const initial: OrderItemData[] = [
  {
    id: 1,
    brand: "NIKE",
    name: "에어맥스 270 스니커즈",
    option: "250",
    price: 159000,
    originalPrice: 189000,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20side%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=cart1&orientation=squarish",
    selected: true,
    stock: 10,
  },
  {
    id: 2,
    brand: "ADIDAS",
    name: "스탠 스미스 스니커즈",
    option: "245",
    price: 109000,
    originalPrice: 109000,
    quantity: 2,
    image:
      "https://readdy.ai/api/search-image?query=white%20leather%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=cart2&orientation=squarish",
    selected: true,
    stock: 10,
  },
  {
    id: 3,
    brand: "CONVERSE",
    name: "척 테일러 올스타",
    option: "255",
    price: 69000,
    originalPrice: 69000,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=white%20converse%20chuck%20taylor%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=cart3&orientation=squarish",
    selected: false,
    stock: 10,
  },
  {
    id: 4,
    brand: "PUMA",
    name: "퓨마 RS-X",
    option: "260",
    price: 129000,
    originalPrice: 129000,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=puma%20rs-x%20white%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=cart4&orientation=squarish",
    selected: false,
    stock: 10,
  },
  {
    id: 5,
    brand: "NEW BALANCE",
    name: "뉴발란스 550",
    option: "265",
    price: 119000,
    originalPrice: 119000,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=new%20balance%20550%20white%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=cart5&orientation=squarish",
    selected: false,
    stock: 10,
  },
  {
    id: 6,
    brand: "NEW BALANCE",
    name: "뉴발란스 550",
    option: "265",
    price: 119000,
    originalPrice: 119000,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=new%20balance%20550%20white%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=cart5&orientation=squarish",
    selected: false,
    stock: 10,
  },
];

export default function CartPage() {
  const nav = useNavigate();
  const [items, setItems] = useState<OrderItemData[]>(initial);

  // 선택/수량 변경
  const toggleItem = (id: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)),
    );
  const changeQty = (id: number, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  const toggleBrand = (brand: string, nextChecked: boolean) =>
    setItems((prev) =>
      prev.map((i) =>
        i.brand === brand ? { ...i, selected: nextChecked } : i,
      ),
    );
  const deleteItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const deleteSelected = () =>
    setItems((prev) => prev.filter((i) => !i.selected));

  // 합계 계산(선택 품목 기준)
  const selected = useMemo(() => items.filter((i) => i.selected), [items]);
  const originalTotal = useMemo(
    () => selected.reduce((s, i) => s + i.originalPrice * i.quantity, 0),
    [selected],
  );
  const discountTotal = useMemo(
    () =>
      selected.reduce(
        (s, i) => s + (i.originalPrice - i.price) * i.quantity,
        0,
      ),
    [selected],
  );
  const productPaid = originalTotal - discountTotal;
  const shippingFee = productPaid >= 50000 ? 0 : productPaid > 0 ? 3000 : 0;
  const finalAmount = productPaid + shippingFee;

  // 항상 장바구니 상태 백업 (Order 복구/할인계산용)
  useEffect(() => {
    try {
      sessionStorage.setItem(SS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // 주문하기
  const handleProceedOrder = () => {
    const sel = items.filter((i) => i.selected);
    if (sel.length === 0) return;

    // Cart 합계 요약 저장 → Order에서 “그대로” 사용
    try {
      sessionStorage.setItem(
        CART_SUMMARY_SS,
        JSON.stringify({
          originalTotal,
          discountTotal,
          productPaid,
        }),
      );
      sessionStorage.setItem(SS_KEY, JSON.stringify(items)); // 안전 백업
    } catch {}

    // 선택 품목만 state로 넘겨도 OK(오더 복구가 mapCartDataToOrderItems 지원)
    nav("/order", {
      state: {
        orderItems: sel.map((i) => ({
          id: i.id,
          brand: i.brand,
          name: i.name,
          size: i.option,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      },
    });
  };

  return (
    <CartTemplate
      items={items}
      selected={selected.length}
      finalAmount={finalAmount}
      onDeleteSelected={deleteSelected}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="장바구니가 비어있습니다"
          description="원하는 상품을 담아보세요"
        />
      ) : (
        <>
          <CartList
            items={items}
            onToggleBrand={toggleBrand}
            onToggleItem={toggleItem}
            onChangeQty={changeQty}
            onDelete={deleteItem}
          />
          <OrderSummary
            originalTotal={originalTotal}
            discountTotal={discountTotal}
            shippingFee={shippingFee}
            finalAmount={finalAmount}
          />
          {/* 주문하기 버튼 (CartTemplate에 동일 기능이 이미 있으면 생략 가능) */}
          {/* <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={handleProceedOrder}
              disabled={selected.length === 0}
              className="rounded-md px-4 py-2 bg-black text-white disabled:opacity-40"
            >
              주문하기
            </button>
          </div> */}
        </>
      )}
    </CartTemplate>
  );
}
