import type React from "react";
import styles from "./Button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "active" | "warning" | "disabled";
  className?: string;
};

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const variantClass = styles[variant];
  return (
    <button
      className={`${styles.base} ${variantClass} ${className}`}
      disabled={variant === "disabled"}
      {...props}
    />
  );
}
