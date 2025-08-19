import type { OrderItemData } from "../../../types/order";
import { Checkbox } from "../../atoms";
import { OrderItem } from "../../molecules";
import styles from "./BrandGroup.module.css";

type BrandGroupProps = {
  brand: string;
  items: OrderItemData[];
  onToggleBrand: (brand: string, nextChecked: boolean) => void;
  onToggleItem: (id: number) => void;
  onChangeQty: (id: number, qty: number) => void;
  onDelete: (id: number) => void;
};

export default function BrandGroup({
  brand,
  items,
  onToggleBrand,
  onToggleItem,
  onChangeQty,
  onDelete,
}: BrandGroupProps) {
  const allChecked = items.every((i) => i.selected);
  const handleBrandToggle = () => onToggleBrand(brand, !allChecked);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Checkbox
          checked={allChecked}
          onChange={handleBrandToggle}
          className={styles.checkbox}
        />
        <span className={styles.brand}>{brand}</span>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
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
}
