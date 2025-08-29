import { Checkbox } from "../../atoms";
import styles from "./FilterSection.module.css";

type FilterSectionProps = {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

export default function FilterSection({
  title,
  options,
  selected,
  onToggle,
}: FilterSectionProps) {
  return (
    <div className={styles.filterSection}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.options}>
        {options.map((opt) => (
          <div key={opt} className={styles.option}>
            <Checkbox
              id={`filter-${title}-${opt}`}
              label={opt}
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
