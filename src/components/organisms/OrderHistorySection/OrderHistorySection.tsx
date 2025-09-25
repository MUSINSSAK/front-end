import { ShoppingBag } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getOrderHistory } from "../../../api/order";
import type {
  OrderHistoryItem,
  OrderHistoryPeriod,
  OrderHistoryStatus,
  Pagination,
} from "../../../types/order";
import { Select, Tag } from "../../atoms";
import { EmptyState, Table } from "../../molecules";
import styles from "./OrderHistorySection.module.css";

const statusToTagVariant = (status: string) => {
  if (status.includes("CANCELLED") || status.includes("EXPIRED")) {
    return "canceled";
  }
  if (status.includes("COMPLETED")) {
    return "success";
  }
  return "processing";
};

export default function OrderHistorySection() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<OrderHistoryPeriod>("3months");
  const [status, setStatus] = useState<OrderHistoryStatus>("ALL");
  const [page, setPage] = useState(0);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getOrderHistory({ period, status, page, size: 5 });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      console.error("주문 내역을 불러오는 데 실패했습니다:", err);
      setError("주문 내역을 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [period, status, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns = [
    { key: "orderInfo", label: "주문 정보" },
    { key: "products", label: "상품 정보" },
    { key: "amount", label: "주문 금액" },
    { key: "status", label: "주문 상태" },
  ];

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>주문 내역</h3>
          <div className={styles.filters}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderHistoryStatus)}
            >
              <option value="ALL">전체 상태</option>
              <option value="ORDERED">주문/배송</option>
              <option value="CANCELLED">취소</option>
              <option value="RETURNED">반품</option>
            </Select>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value as OrderHistoryPeriod)}
            >
              <option value="all">전체 기간</option>
              <option value="1month">1개월</option>
              <option value="3months">3개월</option>
              <option value="6months">6개월</option>
            </Select>
          </div>
        </div>
        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="주문 내역이 없습니다"
            description="아직 주문하신 상품이 없습니다."
          />
        ) : (
          <>
            <Table
              className={styles.table}
              columns={columns}
              data={orders}
              rowClassName={() => styles.row}
              renderRow={(order: OrderHistoryItem) => [
                <div key="orderInfo" className={styles.orderInfo}>
                  <p>{order.orderDate}</p>
                  <p className={styles.orderNumber}>{order.orderNumber}</p>
                </div>,
                <div className={styles.products} key="products">
                  {order.items.map((product, index) => (
                    <div
                      key={`${product.name}-${index}`}
                      className={styles.product}
                    >
                      <img src={product.thumbnailUrl} alt={product.name} />
                      <div>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productDetails}>
                          {product.option}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>,
                `${order.totalAmount.toLocaleString()}원`,
                <Tag
                  variant={statusToTagVariant(order.orderStatus)}
                  key="status"
                >
                  {order.orderStatus}
                </Tag>,
              ]}
            />
            {pagination && pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  이전
                </button>
                <span>
                  {page + 1} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={page + 1 >= pagination.totalPages}
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
