import type { AxiosError } from "axios";
import { Eye, EyeClosed } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login({ email, password });
      console.log("로그인 성공:", data);

      // localStorage와 메모리 상태(zustand)를 모두 업데이트해줍니다.
      setAuth(data.accessToken, data.userId);

      // 메인 페이지('/')로 즉시 리다이렉트(이동)합니다.
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ code: string; message: string }>;
      const errorCode = error.response?.data?.code;

      if (errorCode === "EMAIL_NOT_FOUND" || errorCode === "INVALID_PASSWORD") {
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else {
        setError("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>로그인</h1>
          </div>
          <div>
            <h2 className={styles.logo}>MUSINSSAK</h2>
          </div>
        </div>
      </div>

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
                  disabled={isLoading}
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
                    disabled={isLoading}
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

              {error && <p className={styles.errorMessage}>{error}</p>}

              <div className={styles.forgotPassword}>
                <a href="/find-password" className={styles.link}>
                  비밀번호 찾기
                </a>
              </div>

              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            <div className={styles.signupContainer}></div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
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
      </div>
    </div>
  );
};

export default Login;
