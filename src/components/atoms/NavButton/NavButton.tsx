import styles from "./NavButton.module.css";

type Props = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export default function NavButton({ label, isActive, onClick }: Props) {
  return (
    <button
      type="button"
      className={`${styles.button} ${isActive ? styles.active : styles.default}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
