import { X } from "lucide-react";
import type { OrderItemData } from "../../../types/order";
import { Checkbox, NumberStepper, PriceTag } from "../../atoms";
import styles from "./OrderItem.module.css";

type OrderItemProps = {
  item: OrderItemData;
  onToggleSelect: (id: number) => void;
  onChangeQty: (id: number, qty: number) => void;
  onDelete: (id: number) => void;
  showDivider?: boolean;
};

export default function OrderItem({
  item,
  onToggleSelect,
  onChangeQty,
  onDelete,
  showDivider,
}: OrderItemProps) {
  return (
    <div>
      <div className={styles.container}>
        <Checkbox
          checked={item.selected}
          onChange={() => onToggleSelect(item.id)}
          className={styles.checkbox}
        />
        <img src={item.image} alt={item.name} className={styles.image} />
        <div className={styles.details}>
          <div className={styles.header}>
            <div>
              <p className={styles.brand}>{item.brand}</p>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.size}>{item.option}</p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className={styles.removeBtn}
              aria-label="remove item"
            >
              <X size={15} />
            </button>
          </div>
          <div className={styles.footer}>
            <PriceTag price={item.price} originalPrice={item.originalPrice} />
            <NumberStepper
              value={item.quantity}
              min={1}
              max={item.stock}
              onChange={(v) => onChangeQty(item.id, v)}
            />
          </div>
        </div>
      </div>
      {showDivider && <div className={styles.divider} />}
    </div>
  );
}
