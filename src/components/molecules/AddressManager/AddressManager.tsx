import { useState } from "react";
import type { Address } from "../../../types";
import { Button, Input, Tag } from "../../atoms";
import styles from "./AddressManager.module.css";

type AddressManagerProps = {
  address: Address;
};

export default function AddressManager({ address }: AddressManagerProps) {
  const [form, setForm] = useState<Address>(address);
  const [isEditing, setIsEditing] = useState(false);

  const onDelete = () => {
    // TODO: implement delete logic via callback prop if needed
  };

  const handleChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const save = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.wrapper}>
      {isEditing ? (
        <>
          <div className={styles.header}>
            <div className={styles.labelInputGroup}>
              {form.isDefault && <Tag>기본</Tag>}
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
            <Button onClick={onDelete}>취소</Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.labelInputGroup}>
              {address.isDefault && <Tag>기본</Tag>}
              <span className={styles.type}>{address.type}</span>
            </div>
            <div className={styles.actions}>
              <Button onClick={() => setIsEditing(true)}>수정</Button>
              <Button onClick={onDelete}>삭제</Button>
            </div>
          </div>
          <div className={styles.details}>
            <p>
              {address.recipient} | {address.phone}
            </p>
            <p>{address.address}</p>
            <p>{address.detailAddress}</p>
            <p>({address.zipCode})</p>
          </div>
        </>
      )}
    </div>
  );
}
