import { useEffect, useMemo } from "react";
import type { OrderItemData } from "../../../types/order";
import { Checkbox } from "../../atoms";
import { OrderItem } from "../../molecules";
import styles from "./CartList.module.css";

type CartListProps = {
  items: OrderItemData[];
  onToggleBrand: (brand: string, checked: boolean) => void;
  onToggleItem: (id: number) => void;
  onChangeQty: (id: number, qty: number) => void;
  onDelete: (id: number) => void;
};

export default function CartList({
  items,
  onToggleBrand,
  onToggleItem,
  onChangeQty,
  onDelete,
}: CartListProps) {
  // ✅ Order/Payment에서 복구할 수 있도록 저장
  useEffect(() => {
    try {
      sessionStorage.setItem("musinssak_cart_selected", JSON.stringify(items));
      localStorage.setItem("musinssak_cart_selected", JSON.stringify(items));
    } catch {}
  }, [items]);

  // ✅ 전역(전체) 선택 상태
  const allCheckedAll = useMemo(
    () => items.length > 0 && items.every((i) => i.selected),
    [items],
  );
  const someCheckedAll = useMemo(() => items.some((i) => i.selected), [items]);

  // ✅ 전체선택 토글: 현재와 다른 아이템만 토글 호출
  const handleToggleAll = () => {
    const next = !allCheckedAll;
    items.forEach((it) => {
      if (it.selected !== next) onToggleItem(it.id);
    });
  };

  // ✅ 브랜드별로 그룹
  const grouped = items.reduce<Record<string, OrderItemData[]>>((acc, cur) => {
    if (!acc[cur.brand]) acc[cur.brand] = [];
    acc[cur.brand].push(cur);
    return acc;
  }, {});

  return (
    <div className="space-y-8 mb-8">
      {/* ===== 전역 전체선택 영역 ===== */}
      <div
        className={styles.container}
        style={{ padding: 12, marginBottom: 8 }}
      >
        <div className={styles.header}>
          <Checkbox
            checked={allCheckedAll}
            // 일부 선택 상태를 UI로 표시하고 싶으면 Checkbox 컴포넌트가 indeterminate를 지원하는지 확인 후 넘겨주세요.
            // indeterminate={ !allCheckedAll && someCheckedAll }
            onChange={handleToggleAll}
            className={styles.checkbox}
          />
          <span className={styles.brand}>전체선택</span>
          <span
            className={styles.count}
            style={{ marginLeft: 8, color: "#8b8b8b", fontSize: 12 }}
          >
            선택 {items.filter((i) => i.selected).length} / 총 {items.length}
          </span>
        </div>
      </div>

      {/* ===== 브랜드 그룹들 ===== */}
      {Object.entries(grouped).map(([brand, group]) => {
        const allChecked = group.every((i) => i.selected);

        // 브랜드 전체 토글 (부모에서 일괄 적용하는 핸들러 사용)
        const handleBrandToggle = () => onToggleBrand(brand, !allChecked);

        return (
          <div key={brand} className={styles.container}>
            <div className={styles.header}>
              <Checkbox
                checked={allChecked}
                onChange={handleBrandToggle}
                className={styles.checkbox}
              />
              <span className={styles.brand}>{brand}</span>
              <span className={styles.count}>
                선택 {group.filter((i) => i.selected).length} / {group.length}
              </span>
            </div>

            <div className={styles.list}>
              {group.map((item) => (
                <OrderItem
                  key={item.id}
                  item={item}
                  onToggleSelect={onToggleItem}
                  onChangeQty={onChangeQty}
                  onDelete={onDelete}
                  showDivider={false}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
