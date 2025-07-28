// import { Slider } from "@radix-ui/themes";
import { Input } from "../../atoms";
import styles from "./PriceFilter.module.css";

export type PriceFilterProps = {
  range: [number, number];
  onChange: (range: [number, number]) => void;
};

export default function PriceFilter({ range, onChange }: PriceFilterProps) {
  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>가격대</h4>
      <div className={styles.valueRow}>
        <span>{range[0].toLocaleString()}원</span>
        <span>{range[1].toLocaleString()}원</span>
      </div>
      {/* <Slider defaultValue={[0, 1000000]} /> */}
      <div className={styles.gridInputs}>
        <Input
          className={`${styles.input}`}
          type="number"
          value={range[0]}
          onChange={(e) => onChange([+e.target.value || 0, range[1]])}
          placeholder="최소"
        />
        <Input
          className={`${styles.input}`}
          type="number"
          value={range[1]}
          onChange={(e) => onChange([range[0], +e.target.value || 1000000])}
          placeholder="최대"
        />
      </div>
    </div>
  );
}
