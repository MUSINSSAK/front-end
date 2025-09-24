import { useMemo } from "react";
import type { OrderItemData } from "../../../types/order";
import { CartBrandGroup, CartSelectionBar } from "../../molecules";
import styles from "./CartList.module.css";

type CartListProps = {
  items: OrderItemData[];
  onToggleBrand: (brand: string, checked: boolean) => void;
  onToggleItem: (id: number) => void;
  onChangeQty: (id: number, qty: number) => void;
  onDelete: (id: number) => void;
  onToggleAll?: (checked: boolean) => void;
};

export default function CartList({
  items,
  onToggleBrand,
  onToggleItem,
  onChangeQty,
  onDelete,
  onToggleAll,
}: CartListProps) {
  const totalCount = items.length;
  const selectedCount = useMemo(
    () => items.filter((item) => item.selected).length,
    [items],
  );
  const allChecked = totalCount > 0 && selectedCount === totalCount;

  const grouped = useMemo(() => {
    return items.reduce<Record<string, OrderItemData[]>>((acc, cur) => {
      if (!acc[cur.brand]) acc[cur.brand] = [];
      acc[cur.brand].push(cur);
      return acc;
    }, {});
  }, [items]);

  const handleToggleAll = () => {
    const next = !allChecked;
    if (onToggleAll) {
      onToggleAll(next);
      return;
    }

    items.forEach((item) => {
      if (item.selected !== next) onToggleItem(item.id);
    });
  };

  return (
    <div className={styles.listWrapper}>
      <CartSelectionBar
        checked={allChecked}
        totalCount={totalCount}
        selectedCount={selectedCount}
        onToggle={handleToggleAll}
      />

      {Object.entries(grouped).map(([brand, group]) => (
        <CartBrandGroup
          key={brand}
          brand={brand}
          items={group}
          checked={group.every((item) => item.selected)}
          onToggleBrand={onToggleBrand}
          onToggleItem={onToggleItem}
          onChangeQty={onChangeQty}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
