import type React from "react";
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
  return (
    <div className={styles.container}>
      <CartHeader items={items.length} onDeleteSelected={onDeleteSelected} />

      <div className={styles.content}>{children}</div>

      <CartFooter
        items={items.length}
        selectedCount={selected}
        finalAmount={finalAmount}
      />
    </div>
  );
}
