import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, OrderSummary } from "../../components/molecules";
import { CartList } from "../../components/organisms";
import { CartTemplate } from "../../components/templates";
import type { OrderItemData } from "../../types/order";

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

  // 브랜드 토글 (그룹 전체 토글)
  const toggleBrand = (brand: string, nextChecked: boolean) =>
    setItems((prev) =>
      prev.map((i) =>
        i.brand === brand ? { ...i, selected: nextChecked } : i,
      ),
    );

  // 삭제
  const deleteItem = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const deleteSelected = () =>
    setItems((prev) => prev.filter((i) => !i.selected));

  const selected = items.filter((i) => i.selected);
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

  return (
    <CartTemplate
      items={initial}
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
        </>
      )}
    </CartTemplate>
  );
}
