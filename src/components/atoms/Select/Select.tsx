import type React from "react";
import styles from "./Select.module.css";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className = "", ...props }: SelectProps) {
  return <select className={`${styles.base} ${className}`} {...props} />;
}
