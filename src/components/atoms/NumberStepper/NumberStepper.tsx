import { Minus, Plus } from "lucide-react";
import styles from "./NumberStepper.module.css";

export type NumberStepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
};

export default function NumberStepper({
  value,
  min = 1,
  max,
  onChange,
}: NumberStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={dec}
        className={styles.btn}
        aria-label="decrease"
      >
        <Minus />
      </button>
      <span className={styles.value}>{value}</span>
      <button
        type="button"
        onClick={inc}
        className={styles.btn}
        aria-label="increase"
      >
        <Plus />
      </button>
    </div>
  );
}
