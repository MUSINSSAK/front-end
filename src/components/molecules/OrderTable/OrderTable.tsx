import { BriefcaseBusiness, ShoppingCart } from "lucide-react";
import { Button, Tag } from "../../atoms";
import styles from "./OrderTable.module.css";

type Order = {
  date: string;
  orderNumber: string;
  product: { name: string; image: string; details: string };
  amount: string;
  status: string;
  statusType: "success" | "processing" | "canceled" | "done";
};

type OrderTableProps = {
  orders: Order[];
};

export default function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <BriefcaseBusiness size={31} />
        </div>
        <h3>주문 내역이 없습니다</h3>
        <p>아직 주문하신 상품이 없습니다.</p>
        <Button className={styles.button} type="button" variant="active">
          <ShoppingCart size={15} />
          <span>쇼핑하러 가기</span>
        </Button>
      </div>
    );
  }
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
            <td>
              <div className={styles.product}>
                <img src={o.product.image} alt={o.product.name} />
                <div>
                  <p className={styles.productName}>{o.product.name}</p>
                  <p className={styles.productDetails}>{o.product.details}</p>
                </div>
              </div>
            </td>
            <td>{o.amount}</td>
            <td>
              <Tag variant={o.statusType}>{o.status}</Tag>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
