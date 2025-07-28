import { useNavigate } from "react-router-dom";
import styles from "./Logo.module.css";

export default function Logo() {
  const navigate = useNavigate();
  return (
    <button type="button" className={styles.logo} onClick={() => navigate("/")}>
      MUSINSSAK
    </button>
  );
}
