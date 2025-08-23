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
  const grouped = items.reduce<Record<string, OrderItemData[]>>((acc, cur) => {
    if (!acc[cur.brand]) {
      acc[cur.brand] = [];
    }
    acc[cur.brand].push(cur);
    return acc;
  }, {});

  return (
    <div className="space-y-8 mb-8">
      {Object.entries(grouped).map(([brand, group]) => {
        const allChecked = group.every((i) => i.selected);
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
