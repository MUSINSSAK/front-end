import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import styles from "./Signup.module.css";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      // 다른 모든 약관이 선택되었을 때 '전체 동의'를 자동으로 체크
      newAgreements.all =
        newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
      setAgreements(newAgreements);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("제출된 폼 데이터:", { formData, agreements });
    alert("UI 확인용 회원가입 버튼 클릭!");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
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
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div>
            <div className={styles.titleSection}>
              <h2 className={styles.mainTitle}>회원가입</h2>
              <p className={styles.subtitle}>
                MUSINSSAK에 오신 것을 환영합니다
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
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
                />
              </div>

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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.togglePasswordButton}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>

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
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.togglePasswordButton}
                    aria-label={
                      showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showConfirmPassword ? <Eye /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  이름 *
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
                />
              </div>

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

              <button type="submit" className={styles.submitButton}>
                회원가입
              </button>
            </form>

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
      </main>

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

export default Signup;
