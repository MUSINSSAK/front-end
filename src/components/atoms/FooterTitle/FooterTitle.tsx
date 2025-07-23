import type React from "react";
import type { JSX } from "react";
import styles from "./FooterTitle.module.css";

type FooterTitleProps = { level?: 3 | 4; children: React.ReactNode };

export default function FooterTitle({ level = 4, children }: FooterTitleProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={styles.title}>{children}</Tag>;
}
