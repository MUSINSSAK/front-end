import styles from "./AuthNav.module.css";

export default function AuthNav() {
  return (
    <div className={styles.authContainer}>
      <a href="/login" className={styles.authLink}>
        로그인
      </a>
      <a href="/signup" className={styles.authLink}>
        회원가입
      </a>
    </div>
  );
}
