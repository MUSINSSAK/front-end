import { Ticket } from "lucide-react";
import { useState } from "react";
import type { Coupon } from "../../../types";
import { Button } from "../../atoms";
import { CouponItem, EmptyState } from "../../molecules";
import styles from "./CouponsSection.module.css";

export default function CouponsSection() {
  const [activeTab, setActiveTab] = useState<"사용가능" | "만료예정">(
    "사용가능",
  );

  const onTabChange = (tab: "사용가능" | "만료예정") => {
    setActiveTab(tab);
  };

  const availableCoupons: Coupon[] = [
    {
      discount: "10% 할인",
      title: "여름 세일 쿠폰",
      type: "percent",
      value: 10,
      daysLeft: 30,
      categories: ["의류", "신발"],
      minOrder: 30000,
      maxDiscount: 5000,
      expiryDate: "2025.08.15",
    },
    {
      discount: "₩5000 할인",
      title: "추석 맞이 쿠폰",
      type: "amount",
      value: 5000,
      daysLeft: 60,
      categories: ["식품"],
      minOrder: 20000,
      expiryDate: "2025.09.01",
    },
  ];

  const expiringCoupons: Coupon[] = [
    {
      discount: "10% 할인",
      title: "여름 세일 쿠폰",
      type: "percent",
      value: 10,
      daysLeft: 2,
      categories: ["의류", "신발"],
      minOrder: 30000,
      maxDiscount: 5000,
      expiryDate: "2025.08.15",
    },
    {
      discount: "₩5000 할인",
      title: "추석 맞이 쿠폰",
      type: "amount",
      value: 5000,
      daysLeft: 6,
      categories: ["식품"],
      minOrder: 20000,
      expiryDate: "2025.09.01",
    },
  ];

  const coupons = activeTab === "만료예정" ? expiringCoupons : availableCoupons;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>쿠폰함</h3>
        </div>

        <div className={styles.tabs}>
          {(["사용가능", "만료예정"] as const).map((tab) => (
            <Button
              variant={activeTab === tab ? "active" : undefined}
              type="button"
              key={tab}
              onClick={() => onTabChange(tab)}
              className={styles.tabButton}
            >
              {tab} 쿠폰
            </Button>
          ))}
        </div>

        <div className={styles.list}>
          {coupons.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title={`${activeTab} 쿠폰이 없습니다`}
              description="등록된 쿠폰이 없어요."
            />
          ) : (
            coupons.map((coupon) => (
              <div
                key={`${coupon.title}-${coupon.expiryDate}`}
                className={styles.couponItem}
              >
                <CouponItem coupon={coupon} />
              </div>
            ))
          )}{" "}
        </div>
      </div>
    </div>
  );
}
