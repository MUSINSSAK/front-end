import { Search } from "lucide-react";
import { Input } from "../../atoms";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <Search className={styles.icon} />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="검색어를 입력하세요"
        className={styles.input}
      />
    </div>
  );
}
