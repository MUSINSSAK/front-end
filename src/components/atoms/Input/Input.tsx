import styles from "./Input.module.css";

type InputProps = {
  id?: string;
  type: "text" | "number" | "password" | "email" | "tel" | "date";
  value: string | number;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  className?: string;
};

export default function Input({
  id,
  type,
  value,
  placeholder,
  onChange,
  disabled = false,
  className,
}: InputProps) {
  return (
    <input
      id={id}
      className={`${styles.input} ${className}`}
      type={type}
      min={type === "number" ? 0 : undefined}
      max={type === "number" ? 1000000 : undefined}
      maxLength={type === "text" ? 50 : undefined}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
