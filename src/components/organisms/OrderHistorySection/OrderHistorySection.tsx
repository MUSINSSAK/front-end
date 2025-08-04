import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Order } from "../../../types";
import { Select } from "../../atoms";
import { EmptyState, OrderTable } from "../../molecules";
import styles from "./OrderHistorySection.module.css";

type OrderHistorySectionProps = {
  orders: Order[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
};

export default function OrderHistorySection({
  orders,
  selectedPeriod,
  onPeriodChange,
}: OrderHistorySectionProps) {
  const periods = ["전체 기간", "1개월", "3개월", "6개월"];
  const [selected, setSelected] = useState(selectedPeriod);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>주문 내역</h3>
          <Select
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              onPeriodChange(e.target.value);
            }}
          >
            {periods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </Select>
        </div>
        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="주문 내역이 없습니다"
            description="아직 주문하신 상품이 없습니다."
          />
        ) : (
          <OrderTable orders={orders} />
        )}
      </div>
    </div>
  );
}
