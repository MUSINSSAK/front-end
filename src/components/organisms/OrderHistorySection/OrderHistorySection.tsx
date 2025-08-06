import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Order } from "../../../types";
import { Select } from "../../atoms";
import { EmptyState, OrderTable } from "../../molecules";
import styles from "./OrderHistorySection.module.css";

const dummyOrders: Order[] = [
  {
    date: "2023-10-01",
    orderNumber: "ORD123456",
    products: [
      {
        name: "에어맥스 270 스니커즈",
        image:
          "https://readdy.ai/api/search-image?query=modern%20white%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product1&orientation=squarish",
        details: "사이즈: 255mm / 수량: 1개",
      },
    ],
    amount: "50,000",
    status: "배송 완료",
    statusType: "success",
  },
  {
    date: "2023-09-15",
    orderNumber: "ORD123457",
    products: [
      {
        name: "오버사이즈 블레이저",
        image:
          "https://readdy.ai/api/search-image?query=elegant%20black%20blazer%20jacket%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product2&orientation=squarish",
        details: "사이즈: M / 수량: 1개",
      },
      {
        name: "코튼 와이드 팬츠",
        image:
          "https://readdy.ai/api/search-image?query=beige%20wide%20leg%20pants%20on%20white%20background%20minimalist%20fashion%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product3&orientation=squarish",
        details: "사이즈: L / 수량: 1개",
      },
    ],
    amount: "30,000",
    status: "배송 중",
    statusType: "processing",
  },
  {
    date: "2023-08-20",
    orderNumber: "ORD123458",
    products: [
      {
        name: "그린티 세럼",
        image:
          "https://readdy.ai/api/search-image?query=green%20tea%20serum%20in%20transparent%20bottle%20on%20white%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product9&orientation=squarish",
        details: "수량: 1개",
      },
      {
        name: "레트로 매트 립스틱",
        image:
          "https://readdy.ai/api/search-image?query=elegant%20red%20lipstick%20on%20black%20glossy%20surface%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product11&orientation=squarish",

        details: "호수: 312 / 수량: 1개",
      },
      {
        name: "수분 크림",
        image:
          "https://readdy.ai/api/search-image?query=luxury%20moisturizing%20cream%20in%20elegant%20glass%20jar%20on%20clean%20white%20background%20minimalist%20beauty%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=400&height=400&seq=product8&orientation=squarish",
        details: "수량: 1개",
      },
    ],
    amount: "20,000",
    status: "주문 취소",
    statusType: "canceled",
  },
];

export default function OrderHistorySection() {
  const periods = ["전체 기간", "1개월", "3개월", "6개월"];
  const [selected, setSelected] = useState("전체 기간");

  const onPeriodChange = (period: string) => {
    setSelected(period);
    // 여기에 기간 변경에 따른 추가 로직을 작성할 수 있습니다.
  };

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
        {dummyOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="주문 내역이 없습니다"
            description="아직 주문하신 상품이 없습니다."
          />
        ) : (
          <OrderTable orders={dummyOrders} />
        )}
      </div>
    </div>
  );
}
