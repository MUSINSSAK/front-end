import type { ReactNode } from "react";
import styles from "../../organisms/Order/OrderPage.module.css";

type OrderTemplateProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

export default function OrderTemplate({
  header,
  footer,
  children,
}: OrderTemplateProps) {
  return (
    <div className={styles.pageWrap}>
      {header}
      <main className={styles.main}>{children}</main>
      {footer}
    </div>
  );
}
