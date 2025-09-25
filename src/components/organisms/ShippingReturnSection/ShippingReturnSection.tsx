import styles from "./ShippingReturnSection.module.css";

export default function ShippingReturnSection() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <h3 className={styles.title}>배송 정보</h3>
        <ul className={styles.list}>
          <li>배송비: 3,000원 (5만원 이상 구매시 무료배송)</li>
          <li>배송기간: 주문일로부터 1-3일 (영업일 기준)</li>
          <li>배송지역: 전국 (일부 도서산간 지역 제외)</li>
        </ul>
      </div>

      <div className={styles.block}>
        <h3 className={styles.title}>교환/반품 정보</h3>
        <ul className={styles.list}>
          <li>교환/반품 기간: 상품 수령 후 30일 이내</li>
          <li>교환/반품 비용: 고객 변심시 왕복 배송비 고객 부담</li>
          <li>교환/반품 불가: 착용 흔적이 있는 경우, 상품 택 제거시</li>
        </ul>
      </div>
    </div>
  );
}
