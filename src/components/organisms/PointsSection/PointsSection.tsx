import { useState } from "react";
import { Select } from "../../atoms";
import { Table } from "../../molecules";
import styles from "./PointsSection.module.css";

export default function PointsSection() {
  const periods = ["전체 기간", "1개월", "3개월", "6개월"];
  const [selected, setSelected] = useState("전체 기간");
  const currentPoints = 15000; // 예시 데이터
  const expiringPoints = 5000; // 예시 데이터
  const daysToExpiry = 30; // 예시 데이터
  const records = [
    {
      id: 1,
      date: "2023-10-01",
      description: "상품 구매",
      amount: 5000,
      expiry: "2024-10-01",
    },
    {
      id: 2,
      date: "2023-09-15",
      description: "쿠폰 사용",
      amount: -2000,
      expiry: "2024-09-15",
    },
    {
      id: 3,
      date: "2023-08-20",
      description: "리뷰 작성 보상",
      amount: 3000,
      expiry: "2024-08-20",
    },
  ];
  const columns = [
    { key: "date", label: "날짜" },
    { key: "description", label: "내역" },
    { key: "amount", label: "금액" },
    { key: "expiry", label: "만료예정" },
  ];

  const onPeriodChange = (period: string) => {
    // 여기에 기간 변경 로직을 추가할 수 있습니다.
    console.log(`Selected period: ${period}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>적립금 현황</h3>
          <div className={styles.balance}>
            <span className={styles.balanceLabel}>현재 적립금</span>
            <span className={styles.balanceValue}>
              {currentPoints.toLocaleString()}
            </span>
            <span className={styles.balanceUnit}>원</span>
          </div>
        </div>
        <div className={styles.expiryInfo}>
          <span>소멸 예정: </span>
          <span className={styles.expiringPoints}>
            {expiringPoints.toLocaleString()}원
          </span>
          <span className={styles.expiryDays}>({daysToExpiry}일 후 소멸)</span>
        </div>

        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>적립금 내역</h4>
          <div className={styles.controls}>
            <div className={styles.dropdownWrapper}>
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
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <Table
            className={styles.table}
            columns={columns}
            data={records}
            renderRow={(rec) => [
              rec.date,
              rec.description,
              <span
                className={rec.amount > 0 ? styles.positive : styles.negative}
                key="amount"
              >
                {rec.amount > 0
                  ? `+${rec.amount.toLocaleString()}원`
                  : `${rec.amount.toLocaleString()}원`}
              </span>,
              rec.expiry,
            ]}
          />{" "}
        </div>
      </div>
    </div>
  );
}
