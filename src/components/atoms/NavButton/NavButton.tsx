import { useNavigate } from "react-router-dom";
import styles from "./NavButton.module.css";

type Props = {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export default function NavButton({ id, label, isActive, onClick }: Props) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={`${styles.button} ${isActive ? styles.active : styles.default}`}
      onClick={() => {
        onClick();
        navigate(`category/${id}`);
      }}
    >
      {label}
    </button>
  );
}
