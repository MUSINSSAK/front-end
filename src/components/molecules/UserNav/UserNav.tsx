import { useAuthStore } from "../../../store/authStore";
import { Button } from "../../atoms";
import styles from "./UserNav.module.css";

export default function UserNav() {
  const { logout } = useAuthStore();

  return (
    <div className={styles.container}>
      <a href="/mypage" className={styles.navLink}>
        마이
      </a>
      <a href="/cart" className={styles.navLink}>
        장바구니
      </a>
      <Button type="button" onClick={logout} className={styles.logoutButton}>
        로그아웃
      </Button>
    </div>
  );
}
