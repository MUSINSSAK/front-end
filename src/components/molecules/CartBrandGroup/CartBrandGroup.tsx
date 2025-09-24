import type { OrderItemData } from "../../../types/order";
import { Checkbox } from "../../atoms";
import { OrderItem } from "../../molecules";
import styles from "./CartBrandGroup.module.css";

type CartBrandGroupProps = {
  brand: string;
  items: OrderItemData[];
  checked: boolean;
  onToggleBrand: (brand: string, checked: boolean) => void;
  onToggleItem: (id: number) => void;
  onChangeQty: (id: number, quantity: number) => void;
  onDelete: (id: number) => void;
};

export default function CartBrandGroup({
  brand,
  items,
  checked,
  onToggleBrand,
  onToggleItem,
  onChangeQty,
  onDelete,
}: CartBrandGroupProps) {
  const handleToggleBrand = () => onToggleBrand(brand, !checked);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Checkbox
          checked={checked}
          onChange={handleToggleBrand}
          className={styles.checkbox}
          aria-checked={checked}
        />
        <span className={styles.brand}>{brand}</span>
      </div>

      <div className={styles.list}>
        {items.map((item, index) => (
          <OrderItem
            key={item.id}
            item={item}
            onToggleSelect={onToggleItem}
            onChangeQty={onChangeQty}
            onDelete={onDelete}
            showDivider={index < items.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
