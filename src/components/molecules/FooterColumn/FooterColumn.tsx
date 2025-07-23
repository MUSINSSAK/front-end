import type React from "react";
import { FooterTitle } from "../../atoms";
import styles from "./FooterColumn.module.css";

type FooterColumnProps = {
  title: string;
  links?: { href: string; label: string }[];
  children?: React.ReactNode;
};

export default function FooterColumn({
  title,
  links,
  children,
}: FooterColumnProps) {
  return (
    <div className={styles.column}>
      <FooterTitle level={links ? 4 : 3}>{title}</FooterTitle>
      {links ? (
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.custom}>{children}</div>
      )}
    </div>
  );
}
