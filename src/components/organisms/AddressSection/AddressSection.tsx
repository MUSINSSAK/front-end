import { useState } from "react";
import { Button, Input, Tag } from "../../atoms";
import AddressForm from "../../molecules/AddressForm/AddressForm";
import styles from "./AddressSection.module.css";

const Addresses: Address[] = [
  {
    id: "1",
    type: "집",
    isDefault: true,
    recipient: "홍길동",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    detailAddress: "101호",
    zipCode: "12345",
  },
  {
    id: "2",
    type: "회사",
    isDefault: false,
    recipient: "김철수",
    phone: "010-9876-5432",
    address: "서울시 서초구 서초대로 456",
    detailAddress: "",
    zipCode: "67890",
  },
];

type Address = {
  id: string;
  type: string;
  isDefault: boolean;
  recipient: string;
  phone: string;
  address: string;
  detailAddress: string;
  zipCode: string;
};

export default function AddressSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Address | null>(null);
  const [addNew, setAddNew] = useState<boolean>(false);

  const onEdit = (address: Address) => {
    setForm(address);
    setIsEditing(true);
  };

  const onDelete = () => {
    // TODO: implement delete logic via callback prop if needed
  };

  const handleChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => prev && { ...prev, [field]: e.target.value });

  const onSave = () => {
    if (form) {
      // TODO: form 데이터를 실제 Addresses 배열 또는 API에 반영
    }
    setIsEditing(false);
  };

  const handleAdd = () => {
    setAddNew(true);
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h3>배송지 관리</h3>
        <Button onClick={handleAdd} className={styles.addButton}>
          배송지 추가
        </Button>
      </div>
      <div className={styles.list}>
        {Addresses.map((address) => (
          <div className={styles.wrapper} key={address.id}>
            {isEditing && form?.id === address.id ? (
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
                  <Button onClick={onSave} variant="active">
                    저장
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>취소</Button>
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
                    <Button onClick={() => onEdit(address)}>수정</Button>
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
        ))}
        {addNew && <AddressForm setAddNew={setAddNew} />}
      </div>
    </section>
  );
}
