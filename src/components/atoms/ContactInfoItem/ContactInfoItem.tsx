import type React from "react";
import styles from "./ContactInfoItem.module.css";

type ContactInfoItemProps = { children: React.ReactNode };

export default function ContactInfoItem({ children }: ContactInfoItemProps) {
  return <p className={styles.item}>{children}</p>;
}
