import { useState } from "react";
import type { Address } from "../../../types";
import { Button } from "../../atoms";
import { AddressManager } from "../../molecules";
import AddressForm from "../../molecules/AddressForm/AddressForm";
import styles from "./AddressSection.module.css";

type AddressSectionProps = {
  addresses: Address[];
};

export default function AddressSection({ addresses }: AddressSectionProps) {
  const [addNew, setAddNew] = useState<boolean>(false);
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
        {addresses.map((addr) => (
          <AddressManager key={addr.id} address={addr} />
        ))}
        {addNew && <AddressForm setAddNew={setAddNew} />}
      </div>
    </section>
  );
}
