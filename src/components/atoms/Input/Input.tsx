import styles from "./Input.module.css";

type InputProps = {
  type: "text" | "number" | "password" | "email";
  value: string | number;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
};

export default function Input({
  type,
  value,
  placeholder,
  onChange,
  className,
}: InputProps) {
  return (
    <input
      className={`${styles.input} ${className}`}
      type={type}
      min={type === "number" ? 0 : undefined}
      max={type === "number" ? 1000000 : undefined}
      maxLength={type === "text" ? 50 : undefined}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
