import { ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  changeCartQuantity,
  createOrderFromCart,
  deleteCartItem,
  deleteCartSelected,
  getCart,
  selectCartAll,
  selectCartItems,
} from "../../api/cart";
import { EmptyState, OrderSummary } from "../../components/molecules";
import { CartList } from "../../components/organisms";
import { CartTemplate } from "../../components/templates";
import { useModal } from "../../contexts/ModalContext";
import type { OrderItemData } from "../../types/order";

type LoadingMap = Record<number, boolean>;

type OrderStateForStorage = {
  orderItems: Array<{
    id: number;
    brand: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
    image: string | null;
  }>;
  originalTotal: number;
  cartDiscount: number;
  productPaid: number;
  shippingFee: number;
  finalAmount: number;
};

type CartSummaryForStorage = {
  originalTotal: number;
  discountTotal: number;
  productPaid: number;
  shippingFee: number;
  finalAmount: number;
};

export default function CartPage() {
  const [items, setItems] = useState<OrderItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState<LoadingMap>({});
  const [ordering, setOrdering] = useState(false);
  const { confirm } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const body = await getCart();
        const mapped: OrderItemData[] =
          body?.cartItems?.map(
            (it: {
              cartItemId: number;
              brandName: string;
              productName: string;
              size: string;
              salePrice?: number;
              discountedPrice?: number;
              originalPrice: number;
              quantity: number;
              thumbnailImageUrl?: string;
              productImageUrl?: string;
              selected: boolean;
              stock: number;
            }) => ({
              id: it.cartItemId,
              brand: it.brandName,
              name: it.productName,
              option: String(it.size),
              price: it.salePrice ?? it.discountedPrice ?? it.originalPrice,
              originalPrice: it.originalPrice,
              quantity: it.quantity,
              image: it.thumbnailImageUrl ?? it.productImageUrl ?? "",
              selected: it.selected,
              stock: it.stock,
            }),
          ) ?? [];
        setItems(mapped);
      } catch (e) {
        console.error("장바구니 조회 실패:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleItem = async (id: number) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const next = !target.selected;

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, selected: next } : i)),
    );

    try {
      await selectCartItems([id], next);
    } catch (e) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, selected: !next } : i)),
      );
      console.error("상품 선택 토글 실패:", e);
    }
  };

  const toggleBrand = async (brand: string, nextChecked: boolean) => {
    const ids = items.filter((i) => i.brand === brand).map((i) => i.id);
    if (ids.length === 0) return;

    const prev = items;
    setItems((cur) =>
      cur.map((i) => (i.brand === brand ? { ...i, selected: nextChecked } : i)),
    );

    try {
      await selectCartItems(ids, nextChecked);
    } catch (e) {
      setItems(prev);
      console.error("브랜드 선택 토글 실패:", e);
    }
  };

  const toggleAll = async (checked: boolean) => {
    const prev = items;
    setItems((cur) => cur.map((i) => ({ ...i, selected: checked })));
    try {
      await selectCartAll(checked);
    } catch (e) {
      setItems(prev);
      console.error("전체 선택 토글 실패:", e);
    }
  };

  const changeQty = async (id: number, nextQty: number) => {
    if (loadingMap[id]) return;
    const curItem = items.find((i) => i.id === id);
    if (!curItem) return;

    if (nextQty < 1) nextQty = 1;
    if (curItem.stock && nextQty > curItem.stock) nextQty = curItem.stock;
    if (nextQty === curItem.quantity) return;

    const prevList = items;
    setItems((list) =>
      list.map((i) => (i.id === id ? { ...i, quantity: nextQty } : i)),
    );
    setLoadingMap((m) => ({ ...m, [id]: true }));

    try {
      await changeCartQuantity(id, nextQty);
    } catch (e) {
      setItems(prevList);
      console.error("수량 변경 실패:", e);
    } finally {
      setLoadingMap((m) => {
        const { [id]: _, ...rest } = m;
        return rest;
      });
    }
  };

  const deleteItem = async (id: number) => {
    const ok = await confirm({
      title: "해당 상품을 삭제하시겠어요?",
      description: "선택한 상품이 장바구니에서 제거됩니다.",
      confirmText: "삭제",
      cancelText: "취소",
    });
    if (!ok) return;

    const prev = items;
    setItems((list) => list.filter((i) => i.id !== id));
    try {
      await deleteCartItem(id);
    } catch (e) {
      setItems(prev);
      console.error("상품 삭제 실패:", e);
    }
  };

  const deleteSelected = async () => {
    const ok = await confirm({
      title: "선택한 상품을 삭제하시겠어요?",
      description: "선택한 모든 상품이 장바구니에서 제거됩니다.",
      confirmText: "삭제",
      cancelText: "취소",
    });
    if (!ok) return;

    const ids = items.filter((i) => i.selected).map((i) => i.id);
    if (ids.length === 0) return;

    const prev = items;
    setItems((list) => list.filter((i) => !ids.includes(i.id)));
    try {
      await deleteCartSelected(ids);
    } catch (e) {
      setItems(prev);
      console.error("상품 삭제 실패:", e);
    }
  };

  const selectedItems = items.filter((i) => i.selected);
  const originalTotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.originalPrice * item.quantity,
        0,
      ),
    [selectedItems],
  );
  const discountTotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
        0,
      ),
    [selectedItems],
  );
  const productPaid = originalTotal - discountTotal;
  const shippingFee = productPaid >= 50000 ? 0 : productPaid > 0 ? 3000 : 0;
  const finalAmount = productPaid + shippingFee;

  useEffect(() => {
    try {
      const serialized = JSON.stringify(items);
      sessionStorage.setItem("musinssak_cart_selected", serialized);
      localStorage.setItem("musinssak_cart_selected", serialized);
    } catch (e) {
      console.error("장바구니 선택 상태 저장 실패:", e);
    }
  }, [items]);

  useEffect(() => {
    try {
      const summary: CartSummaryForStorage = {
        originalTotal,
        discountTotal,
        productPaid,
        shippingFee,
        finalAmount,
      };
      sessionStorage.setItem("musinssak_cart_summary", JSON.stringify(summary));
    } catch (e) {
      console.error("장바구니 요약 저장 실패:", e);
    }
  }, [originalTotal, discountTotal, productPaid, shippingFee, finalAmount]);

  useEffect(() => {
    try {
      const orderState: OrderStateForStorage = {
        orderItems: selectedItems.map((item) => ({
          id: item.id,
          brand: item.brand,
          name: item.name,
          size: item.option,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        originalTotal,
        cartDiscount: discountTotal,
        productPaid,
        shippingFee,
        finalAmount,
      };
      sessionStorage.setItem(
        "musinssak_order_state",
        JSON.stringify(orderState),
      );
    } catch (e) {
      console.error("주문 상태 저장 실패:", e);
    }
  }, [
    selectedItems,
    originalTotal,
    discountTotal,
    productPaid,
    shippingFee,
    finalAmount,
  ]);

  const handleOrder = async () => {
    if (ordering) return;
    const cartItemIds = items.filter((i) => i.selected).map((i) => i.id);
    if (cartItemIds.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    try {
      setOrdering(true);
      const created = await createOrderFromCart(cartItemIds);
      sessionStorage.setItem("musinssak_recent_order", JSON.stringify(created));
      navigate("/order", {
        state: { orderPk: created.orderPk, orderId: created.orderId },
      });
    } catch (e: unknown) {
      const error = e as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (error?.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login", { replace: true });
        return;
      }
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "주문 생성에 실패했습니다. 잠시 후 다시 시도해주세요.";
      alert(msg);
      console.error("주문 생성 실패:", e);
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <CartTemplate
        items={[]}
        selected={0}
        finalAmount={0}
        onDeleteSelected={() => {}}
      >
        <div className="p-8 text-center text-sm text-muted-foreground">
          장바구니를 불러오는 중입니다.
        </div>
      </CartTemplate>
    );
  }

  return (
    <CartTemplate
      items={items}
      selected={selectedItems.length}
      finalAmount={finalAmount}
      onDeleteSelected={deleteSelected}
      onOrder={handleOrder}
      ordering={ordering}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="장바구니가 비어 있습니다"
          description="관심있는 상품을 담아보세요."
        />
      ) : (
        <>
          <CartList
            items={items}
            onToggleBrand={toggleBrand}
            onToggleItem={toggleItem}
            onChangeQty={changeQty}
            onDelete={deleteItem}
            onToggleAll={toggleAll}
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
