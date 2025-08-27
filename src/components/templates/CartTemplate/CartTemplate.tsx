import type React from "react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { OrderItemData } from "../../../types/order";
import { CartFooter, CartHeader } from "../../organisms";
import styles from "./CartTemplate.module.css";

type CartTemplateProps = {
  items: OrderItemData[];
  selected: number;
  finalAmount: number;
  onDeleteSelected: () => void;
  children: React.ReactNode;
};

export default function CartTemplate({
  items,
  selected,
  finalAmount,
  onDeleteSelected,
  children,
}: CartTemplateProps) {
  const nav = useNavigate();

  // 선택된 항목 기준으로 요약 계산 (세션에 저장된 최신 items가 더 신뢰되지만,
  // props로도 한 번 더 계산해 둔다)
  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);
  const originalTotal = useMemo(
    () => selectedItems.reduce((s, i) => s + i.originalPrice * i.quantity, 0),
    [selectedItems],
  );
  const discountTotal = useMemo(
    () =>
      selectedItems.reduce(
        (s, i) => s + (i.originalPrice - i.price) * i.quantity,
        0,
      ),
    [selectedItems],
  );
  const productPaid = originalTotal - discountTotal;
  const shippingFee = productPaid >= 50000 ? 0 : productPaid > 0 ? 3000 : 0;
  const computedFinal = productPaid + shippingFee;

  // ✅ 최신 카트 상태를 세션에서 읽고, "주문 요약"을 세션에 저장
  useEffect(() => {
    try {
      // CartList가 항상 최신 items를 저장해둠
      const raw =
        sessionStorage.getItem("musinssak_cart_selected") ||
        localStorage.getItem("musinssak_cart_selected");
      const cart: OrderItemData[] = raw ? JSON.parse(raw) : items;

      const picked = (cart || []).filter((i) => i.selected);

      const orig = picked.reduce((s, i) => s + i.originalPrice * i.quantity, 0);
      const disc = picked.reduce(
        (s, i) => s + (i.originalPrice - i.price) * i.quantity,
        0,
      );
      const paid = orig - disc;
      const ship = paid >= 50000 ? 0 : paid > 0 ? 3000 : 0;
      const final = paid + ship;

      // Order에서 바로 쓰기 좋은 형태로 저장
      const orderState = {
        orderItems: picked.map((i) => ({
          id: i.id,
          brand: i.brand,
          name: i.name,
          size: i.option, // Order가 size를 쓰므로 option -> size로 맵핑
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        // 요약들
        originalTotal: orig,
        cartDiscount: disc, // ✅ 카트(세일) 할인 금액
        productPaid: paid, // 할인적용 후 상품금액
        shippingFee: ship,
        finalAmount: final,
      };

      sessionStorage.setItem(
        "musinssak_order_state",
        JSON.stringify(orderState),
      );
    } catch {}
  }, [items]);

  const handleOrder = () => {
    nav("/order");
  };

  return (
    <div className={styles.container}>
      <CartHeader items={items.length} onDeleteSelected={onDeleteSelected} />

      <div className={styles.content}>{children}</div>

      <CartFooter
        items={items.length}
        selectedCount={selected}
        finalAmount={computedFinal} // 계산값을 다시 안전하게 사용
        onOrder={handleOrder}
      />
    </div>
  );
}
