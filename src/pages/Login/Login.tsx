import { Eye, EyeClosed } from "lucide-react";
import { type FormEvent, useState } from "react";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password });
    alert("UI 확인용 로그인 버튼이 클릭되었습니다.");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>로그인</h1>
          </div>
          <div>
            <h2 className={styles.logo}>MUSINSSAK</h2>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.formWrapper}>
          <div className={styles.formContainer}>
            <div className={styles.welcomeTextContainer}>
              <h2 className={styles.welcomeTitle}>환영합니다</h2>
              <p className={styles.welcomeSubtitle}>
                MUSINSSAK 계정으로 로그인하세요
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  이메일 또는 아이디
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="이메일 또는 아이디를 입력하세요"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  비밀번호
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.input} ${styles.passwordInput}`}
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={styles.togglePasswordButton}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              <div className={styles.forgotPassword}>
                <a href="/find-password" className={styles.link}>
                  비밀번호 찾기
                </a>
              </div>

              <button type="submit" className={styles.loginButton}>
                로그인
              </button>
            </form>

            <div className={styles.signupContainer}></div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerInner}>
            <p className={styles.footerText}>
              고객센터: 1588-0000 | 평일 09:00~18:00 (주말/공휴일 휴무)
            </p>
            <p className={styles.footerCopyright}>
              &copy; 2024 MUSINSSAK. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
