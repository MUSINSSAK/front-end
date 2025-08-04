import type { Order } from "../../../types";
import { Tag } from "../../atoms";
import styles from "./OrderTable.module.css";

type OrderTableProps = {
  orders: Order[];
};

export default function OrderTable({ orders }: OrderTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {["주문일자", "주문번호", "상품정보", "주문금액", "주문상태"].map(
            (h) => (
              <th key={h}>{h}</th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.orderNumber} className={styles.row}>
            <td>{o.date}</td>
            <td>{o.orderNumber}</td>
            <td className={styles.products}>
              {o.products.map((p) => (
                <div key={p.name} className={styles.product}>
                  <img src={p.image} alt={p.name} />
                  <div>
                    <p className={styles.productName}>{p.name}</p>
                    <p className={styles.productDetails}>{p.details}</p>
                  </div>
                </div>
              ))}
            </td>
            <td>{o.amount}원</td>
            <td>
              <Tag variant={o.statusType}>{o.status}</Tag>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
