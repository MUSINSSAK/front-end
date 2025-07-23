import styles from "./Input.module.css";

type InputProps = {
  value: string;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
};

export default function Input({
  value,
  placeholder,
  onChange,
  className,
}: InputProps) {
  return (
    <input
      className={`${styles.input} ${className}`}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
