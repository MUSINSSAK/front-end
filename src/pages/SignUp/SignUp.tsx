import type { AxiosError } from "axios";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import styles from "./SignUp.module.css";

const Signup = () => {
  const navigate = useNavigate();
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

  // 비밀번호 유효성 검사
  const validatePassword = (password: string, email: string) => {
    if (password.length < 8 || password.length > 16) {
      return "비밀번호는 8자 이상 16자 이하로 설정해주세요.";
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);
    const typesCount = [
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;
    if (typesCount < 3) {
      return "영문 대소문자, 숫자, 특수문자 중 3가지 이상을 조합해주세요.";
    }

    for (let i = 0; i < password.length - 2; i++) {
      if (
        password[i] === password[i + 1] &&
        password[i + 1] === password[i + 2]
      ) {
        return "동일한 문자나 숫자를 3개 이상 연속으로 사용할 수 없습니다.";
      }
    }

    const emailId = email.split("@")[0];
    if (emailId && password.includes(emailId)) {
      return "비밀번호에 아이디(이메일)를 포함할 수 없습니다.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!agreements.terms || !agreements.privacy) {
      setError("필수 약관에 동의해야 합니다.");
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(formData.password, formData.email);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.name,
      });
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
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
                    placeholder="8~16자, 영문/숫자/특수문자 3가지 이상 조합"
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
                disabled={isLoading}
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
