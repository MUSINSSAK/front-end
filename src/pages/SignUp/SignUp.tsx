import type { AxiosError } from "axios"; // AxiosError 타입 임포트
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { register } from "../../api/authApi"; // register 함수 임포트
import styles from "./SignUp.module.css";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "", // UI 필드는 name이지만, API에는 nickname으로 전송
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  // 로딩 및 에러 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // 입력 시 에러 메시지 초기화
  };

  const handleAgreementChange = (field: string, checked: boolean) => {
    if (field === "all") {
      setAgreements({
        all: checked,
        terms: checked,
        privacy: checked,
        marketing: checked,
      });
    } else {
      const newAgreements = {
        ...agreements,
        [field]: checked,
      };
      newAgreements.all =
        newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
      setAgreements(newAgreements);
    }
    setError(""); // 약관 변경 시 에러 메시지 초기화
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 필수 약관 동의 확인 (이용약관, 개인정보 처리방침)
    if (!agreements.terms || !agreements.privacy) {
      setError("필수 약관에 동의해야 합니다.");
      setIsLoading(false);
      return;
    }

    // 비밀번호 일치 여부 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      // 명세서에 따라 'name' 필드를 'nickname'으로 전송
      await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.name, // UI의 name 필드를 nickname으로 매핑
      });
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      window.location.href = "/login"; // 회원가입 성공 시 로그인 페이지로 이동
    } catch (err) {
      const error = err as AxiosError<{ code: string; message: string }>;
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.message;

      if (errorCode === "EMAIL_DUPLICATED") {
        setError("이미 사용 중인 이메일입니다.");
      } else if (errorCode === "NICKNAME_DUPLICATED") {
        setError("이미 사용 중인 닉네임입니다.");
      } else if (errorCode === "INVALID_REQUEST") {
        setError("입력 형식이 올바르지 않습니다.");
      } else {
        setError(
          errorMessage || "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        );
      }
      console.error("회원가입 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInner}>
            <div className={styles.headerLeft}>
              <a href="/login" className={styles.backLink}>
                <i className={`fas fa-arrow-left ${styles.backIcon}`}></i>
              </a>
              <h1 className={styles.headerTitle}>회원가입</h1>
            </div>
            <div>
              <h2 className={styles.logo}>MUSINSSAK</h2>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.formContainer}>
          <div>
            <div className={styles.titleSection}>
              <h2 className={styles.mainTitle}>회원가입</h2>
              <p className={styles.subtitle}>
                MUSINSSAK에 오신 것을 환영합니다
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  이메일 *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={styles.input}
                  placeholder="이메일을 입력하세요"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  비밀번호 *
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`${styles.input} ${styles.passwordInput}`}
                    placeholder="비밀번호를 입력하세요"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.togglePasswordButton}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  비밀번호 확인 *
                </label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`${styles.input} ${styles.passwordInput}`}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.togglePasswordButton}
                    aria-label={
                      showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              {/* Name Input (will be sent as nickname) */}
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  이름 * (닉네임으로 사용됩니다)
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={styles.input}
                  placeholder="이름을 입력하세요"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Error message display */}
              {error && <p className={styles.errorMessage}>{error}</p>}

              {/* Terms Agreement Section */}
              <div className={styles.agreementSection}>
                <h3 className={styles.agreementTitle}>약관 동의</h3>

                {/* All Agreement */}
                <div className={styles.agreementItem}>
                  <input
                    id="agree-all"
                    type="checkbox"
                    checked={agreements.all}
                    onChange={(e) =>
                      handleAgreementChange("all", e.target.checked)
                    }
                    className={styles.checkbox}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="agree-all"
                    className={`${styles.checkboxLabel} ${styles.allAgreementLabel}`}
                  >
                    전체 동의
                  </label>
                </div>

                <div className={styles.agreementDivider}>
                  {/* Terms Agreement */}
                  <div className={styles.agreementItemWithButton}>
                    <div className={styles.agreementLeft}>
                      <input
                        id="agree-terms"
                        type="checkbox"
                        checked={agreements.terms}
                        onChange={(e) =>
                          handleAgreementChange("terms", e.target.checked)
                        }
                        className={styles.checkbox}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="agree-terms"
                        className={`${styles.checkboxLabel} ${styles.agreementLabel}`}
                      >
                        [필수] 이용약관 동의
                      </label>
                    </div>
                    <button type="button" className={styles.viewButton}>
                      보기
                    </button>
                  </div>

                  {/* Privacy Agreement */}
                  <div className={styles.agreementItemWithButton}>
                    <div className={styles.agreementLeft}>
                      <input
                        id="agree-privacy"
                        type="checkbox"
                        checked={agreements.privacy}
                        onChange={(e) =>
                          handleAgreementChange("privacy", e.target.checked)
                        }
                        className={styles.checkbox}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="agree-privacy"
                        className={`${styles.checkboxLabel} ${styles.agreementLabel}`}
                      >
                        [필수] 개인정보 처리방침 동의
                      </label>
                    </div>
                    <button type="button" className={styles.viewButton}>
                      보기
                    </button>
                  </div>

                  {/* Marketing Agreement */}
                  <div className={styles.agreementItemWithButton}>
                    <div className={styles.agreementLeft}>
                      <input
                        id="agree-marketing"
                        type="checkbox"
                        checked={agreements.marketing}
                        onChange={(e) =>
                          handleAgreementChange("marketing", e.target.checked)
                        }
                        className={styles.checkbox}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="agree-marketing"
                        className={`${styles.checkboxLabel} ${styles.agreementLabel}`}
                      >
                        [선택] 마케팅 정보 수신 동의
                      </label>
                    </div>
                    <button type="button" className={styles.viewButton}>
                      보기
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading} // 로딩 중 버튼 비활성화
              >
                {isLoading ? "회원가입 중..." : "회원가입"}
              </button>
            </form>

            {/* Login Link */}
            <div className={styles.loginSection}>
              <p className={styles.loginText}>
                이미 회원이신가요?{" "}
                <a href="/login" className={styles.loginLink}>
                  로그인
                </a>
              </p>
            </div>
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

export default Signup;
