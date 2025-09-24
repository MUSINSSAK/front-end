import type React from "react";
import type { OrderItemData } from "../../../types/order";
import { CartFooter, CartHeader } from "../../organisms";
import styles from "./CartTemplate.module.css";

type CartTemplateProps = {
  items: OrderItemData[];
  selected: number;
  finalAmount: number;
  onDeleteSelected: () => void;
  onOrder?: () => void;
  ordering?: boolean;
  children: React.ReactNode;
};

export default function CartTemplate({
  items,
  selected,
  finalAmount,
  onDeleteSelected,
  onOrder,
  ordering = false,
  children,
}: CartTemplateProps) {
  return (
    <div className={styles.container}>
      <CartHeader items={items.length} onDeleteSelected={onDeleteSelected} />

      <div className={styles.content}>{children}</div>

      <CartFooter
        items={items.length}
        selectedCount={selected}
        finalAmount={finalAmount}
        onOrder={onOrder}
        ordering={ordering}
      />
    </div>
  );
}
