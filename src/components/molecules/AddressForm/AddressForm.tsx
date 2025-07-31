import type React from "react";
import { useState } from "react";
import type { Address } from "../../../types";
import { Button, Input } from "../../atoms";
import styles from "./AddressForm.module.css";

type AddressFormProps = {
  setAddNew: (value: boolean) => void;
};

export default function AddressForm({ setAddNew }: AddressFormProps) {
  const [form, setForm] = useState<Address>({
    id: "",
    type: "",
    isDefault: false,
    recipient: "",
    phone: "",
    address: "",
    detailAddress: "",
    zipCode: "",
  });

  const handleChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const save = () => {
    setAddNew(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.labelInputGroup}>
          <Input
            id="type-input"
            type="text"
            value={form.type}
            onChange={handleChange("type")}
            placeholder="배송지 이름"
            className={styles.field}
          />
        </div>
      </div>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label htmlFor="recipient-input">수취인</label>
          <Input
            id="recipient-input"
            type="text"
            value={form.recipient}
            onChange={handleChange("recipient")}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone-input">연락처</label>
          <Input
            id="phone-input"
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
          />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="address-input">주소</label>
        <Input
          id="address-input"
          type="text"
          value={form.address}
          onChange={handleChange("address")}
        />
        <Input
          type="text"
          value={form.detailAddress}
          onChange={handleChange("detailAddress")}
        />
        <Input
          type="text"
          value={form.zipCode}
          onChange={handleChange("zipCode")}
        />
      </div>
      <div className={styles.actions}>
        <Button onClick={save} variant="active">
          저장
        </Button>
        <Button onClick={() => setAddNew(false)}>취소</Button>
      </div>
    </div>
  );
}
