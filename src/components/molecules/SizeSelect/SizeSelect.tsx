import { Select } from "../../atoms";
import styles from "./SizeSelect.module.css";

type Props = {
  sizes: string[];
  value: string;
  onChange: (v: string) => void;
};

export default function SizeSelect({ sizes, value, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.label}>사이즈 선택</h3>
      <Select value={value} onChange={handleChange}>
        <option value="" disabled>
          사이즈를 선택하세요
        </option>
        {sizes.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>
    </div>
  );
}
