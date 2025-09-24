import styles from "../OrderPage.module.css";

type OrdererInfo = {
  name: string;
  email: string;
  phone: string;
  sameAsDelivery: boolean;
};

type OrdererInfoSectionProps = {
  info: OrdererInfo;
  onChange: (field: keyof OrdererInfo, value: string | boolean) => void;
  onToggleSameAsDelivery: () => void;
  ids: {
    name: string;
    email: string;
    phone: string;
  };
};

export default function OrdererInfoSection({
  info,
  onChange,
  onToggleSameAsDelivery,
  ids,
}: OrdererInfoSectionProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>주문자 정보</h2>

      <button
        type="button"
        className={styles.sameRow}
        onClick={onToggleSameAsDelivery}
      >
        <span
          className={`${styles.checkSquare} ${info.sameAsDelivery ? styles.checkOn : ""}`}
          aria-hidden
        />
        <span className={styles.sameLabel}>배송지 정보와 동일</span>
      </button>

      <div className={styles.formStack}>
        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.name}>
            이름 <span className={styles.req}>*</span>
          </label>
          <input
            id={ids.name}
            className={styles.input}
            value={info.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="주문자 이름"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.email}>
            이메일 <span className={styles.req}>*</span>
          </label>
          <input
            id={ids.email}
            className={styles.input}
            value={info.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="example@email.com"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.label} htmlFor={ids.phone}>
            연락처 <span className={styles.req}>*</span>
          </label>
          <input
            id={ids.phone}
            className={styles.input}
            value={info.phone}
            onChange={(event) => onChange("phone", event.target.value)}
            placeholder="010-0000-0000"
          />
        </div>
      </div>
    </section>
  );
}
