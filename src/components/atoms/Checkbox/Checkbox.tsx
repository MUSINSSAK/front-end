import type React from "react";
import styles from "./Checkbox.module.css";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
};

export default function Checkbox({
  id,
  className = "",
  label,
  ...props
}: CheckboxProps) {
  return (
    <label htmlFor={id} className={styles.label}>
      <input
        id={id}
        type="checkbox"
        className={`${styles.base} ${className}`}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
