import { Eye, EyeClosed } from "lucide-react";
import { type FormEvent, useState } from "react";
import styles from "./FindPassword.module.css";

const FindPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [accountInfo, setAccountInfo] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timeLeft] = useState(180); // 인증 제한 시간 (3분)

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("새 비밀번호로 변경 시도:", { newPassword });
    alert("UI 확인용 비밀번호 변경 버튼이 클릭되었습니다.");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderStepIndicator = () => (
    <div className={styles.stepIndicatorContainer}>
      {[1, 2, 3].map((step) => (
        <div key={step} className={styles.stepItem}>
          <div
            className={`${styles.stepCircle} ${
              step <= currentStep ? styles.active : ""
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`${styles.stepConnector} ${
                step < currentStep ? styles.active : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <div>
        <label htmlFor="account" className={styles.label}>
          이메일 또는 아이디
        </label>
        <input
          id="account"
          type="text"
          value={accountInfo}
          onChange={(e) => setAccountInfo(e.target.value)}
          className={styles.input}
          placeholder="이메일 또는 아이디를 입력하세요"
        />
      </div>
      <div className={styles.infoText}>
        <i className="fas fa-envelope"></i>
        <span>이메일로 인증됩니다</span>
      </div>
      <button
        type="button"
        onClick={handleNextStep}
        className={styles.buttonPrimary}
      >
        다음
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <p className={styles.subtleText}>
        이메일로 전송된 인증번호를 입력해주세요
      </p>
      <div>
        <label htmlFor="verification-code" className={styles.label}>
          인증번호
        </label>
        <div className={styles.inputWithButton}>
          <input
            id="verification-code"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className={styles.input}
            placeholder="인증번호 6자리"
            maxLength={6}
          />
          <button type="button" className={styles.buttonSecondary}>
            재전송
          </button>
        </div>
      </div>
      <div className={styles.timerText}>남은 시간: {formatTime(timeLeft)}</div>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevStep}
          className={styles.buttonSecondary}
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className={styles.buttonPrimary}
        >
          인증확인
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <form onSubmit={handleSubmit} className={styles.stepContent}>
      <div>
        <label htmlFor="new-password" className={styles.label}>
          새 비밀번호
        </label>
        <div className={styles.passwordInputWrapper}>
          <input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            placeholder="새 비밀번호를 입력하세요"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className={styles.togglePasswordButton}
            aria-label={showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showNewPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="confirm-password" className={styles.label}>
          비밀번호 확인
        </label>
        <div className={styles.passwordInputWrapper}>
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            placeholder="비밀번호를 다시 입력하세요"
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
      <div className={styles.rulesBox}>
        <h4>비밀번호 규칙</h4>
        <ul>
          <li>• 8자 이상 16자 이하</li>
          <li>• 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합</li>
          <li>• 연속된 문자나 숫자 3개 이상 사용 금지</li>
          <li>• 아이디와 동일하거나 포함된 비밀번호 사용 금지</li>
        </ul>
      </div>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevStep}
          className={styles.buttonSecondary}
        >
          이전
        </button>
        <button type="submit" className={styles.buttonPrimary}>
          비밀번호 변경
        </button>
      </div>
    </form>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <h1>비밀번호 찾기</h1>
          </div>
          <div className={styles.headerRight}>
            <h2>MUSINSSAK</h2>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.formWrapper}>
          <div className={styles.formContainer}>
            <div className={styles.titleSection}>
              <h2>비밀번호 찾기</h2>
              <p>
                {currentStep === 1 &&
                  "비밀번호를 찾고자 하는 계정의 정보를 입력해주세요"}
                {currentStep === 2 && "인증번호를 확인해주세요"}
                {currentStep === 3 && "새로운 비밀번호를 설정해주세요"}
              </p>
            </div>
            {renderStepIndicator()}
            <div>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>고객센터: 1588-0000 | 평일 09:00~18:00 (주말/공휴일 휴무)</p>
          <p>&copy; 2024 MUSINSSAK. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FindPassword;
