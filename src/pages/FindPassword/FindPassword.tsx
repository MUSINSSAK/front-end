import type { AxiosError } from "axios";
import { Eye, EyeClosed } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  requestPasswordResetCode,
  resetPassword,
  verifyPasswordResetCode,
} from "../../api/authApi";
import styles from "./FindPassword.module.css";

const FindPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState(""); // accountInfo를 email로 변경
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 로딩 및 에러 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 인증번호 타이머 관련 상태
  const [timeLeft, setTimeLeft] = useState(0); // 0분 0초부터 시작
  const timerRef = useRef<number | null>(null);
  const VERIFICATION_CODE_EXPIRY_SECONDS = 3 * 60; // 3분으로 설정

  // 타이머 시작/정지 로직
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft]);

  const handleNextStep = async () => {
    setError(""); // 다음 단계로 넘어가기 전에 에러 메시지 초기화
    setIsLoading(true);

    try {
      if (currentStep === 1) {
        // 1단계: 이메일 입력 -> 인증번호 전송
        await requestPasswordResetCode({ email });
        alert("인증번호가 이메일로 전송되었습니다. (유효시간 3분)"); // UI에 3분으로 표시
        setTimeLeft(VERIFICATION_CODE_EXPIRY_SECONDS); // 타이머 시작
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // 2단계: 인증번호 입력 -> 인증 확인
        if (timeLeft === 0) {
          setError("인증번호 유효 시간이 만료되었습니다. 다시 요청해주세요.");
          return;
        }
        await verifyPasswordResetCode({ email, code: verificationCode });
        alert("인증번호 확인이 완료되었습니다.");
        if (timerRef.current) {
          clearInterval(timerRef.current); // 타이머 정지
        }
        setCurrentStep(3);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ code: string; message: string }>;
      const errorCode = axiosError.response?.data?.code;
      const errorMessage = axiosError.response?.data?.message;

      // 각 단계별 에러 처리
      if (currentStep === 1) {
        if (errorCode === "EMAIL_NOT_FOUND") {
          setError("등록되지 않은 이메일입니다.");
        } else if (errorCode === "INVALID_REQUEST") {
          setError("이메일 형식이 올바르지 않습니다.");
        } else {
          setError(errorMessage || "인증번호 요청 중 오류가 발생했습니다.");
        }
      } else if (currentStep === 2) {
        if (errorCode === "INVALID_CODE") {
          setError("인증번호가 일치하지 않습니다.");
        } else if (errorCode === "CODE_EXPIRED") {
          setError("인증번호가 만료되었습니다. 재전송 해주세요.");
          setTimeLeft(0); // 타이머 초기화
        } else if (errorCode === "EMAIL_NOT_FOUND") {
          setError("인증을 요청한 이메일이 아닙니다.");
        } else {
          setError(errorMessage || "인증번호 확인 중 오류가 발생했습니다.");
        }
      }
      console.error("비밀번호 찾기 API 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevStep = () => {
    setError(""); // 이전 단계로 돌아갈 때 에러 메시지 초기화
    if (timerRef.current) {
      clearInterval(timerRef.current); // 타이머 정지
    }
    if (currentStep === 2) {
      setTimeLeft(0); // 2단계에서 1단계로 돌아갈 때 타이머 초기화
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);
    try {
      await requestPasswordResetCode({ email });
      alert("인증번호가 다시 전송되었습니다. (유효시간 3분)");
      setTimeLeft(VERIFICATION_CODE_EXPIRY_SECONDS); // 타이머 재시작
    } catch (err) {
      const axiosError = err as AxiosError<{ code: string; message: string }>;
      const errorCode = axiosError.response?.data?.code;
      const errorMessage = axiosError.response?.data?.message;

      if (errorCode === "EMAIL_NOT_FOUND") {
        setError("등록되지 않은 이메일입니다.");
      } else if (errorCode === "INVALID_REQUEST") {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError(errorMessage || "인증번호 재전송 중 오류가 발생했습니다.");
      }
      console.error("인증번호 재전송 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword({ email, newPassword });
      alert(
        "비밀번호가 성공적으로 재설정되었습니다! 로그인 페이지로 이동합니다.",
      );
      window.location.href = "/login"; // 비밀번호 변경 성공 시 로그인 페이지로 이동
    } catch (err) {
      const axiosError = err as AxiosError<{ code: string; message: string }>;
      const errorCode = axiosError.response?.data?.code;
      const errorMessage = axiosError.response?.data?.message;

      if (errorCode === "UNVERIFIED_EMAIL") {
        setError("인증되지 않은 이메일입니다. 다시 인증해주세요.");
        setCurrentStep(2); // 인증 단계로 돌려보낼 수도 있음
      } else if (errorCode === "EMAIL_NOT_FOUND") {
        setError("이메일 정보를 찾을 수 없습니다.");
      } else if (errorCode === "INVALID_REQUEST") {
        setError("새 비밀번호 형식이 올바르지 않습니다. 규칙을 확인해주세요.");
      } else {
        setError(errorMessage || "비밀번호 재설정 중 오류가 발생했습니다.");
      }
      console.error("비밀번호 재설정 오류:", err);
    } finally {
      setIsLoading(false);
    }
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
        <label htmlFor="email" className={styles.label}>
          이메일 또는 아이디
        </label>
        <input
          id="email"
          type="email" // email 타입으로 변경
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          placeholder="이메일 또는 아이디를 입력하세요"
          required
          disabled={isLoading}
        />
      </div>
      <div className={styles.infoText}>
        <i className="fas fa-envelope"></i>
        <span>입력하신 이메일로 인증번호가 전송됩니다.</span>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}{" "}
      {/* 에러 메시지 표시 */}
      <button
        type="button"
        onClick={handleNextStep}
        className={styles.buttonPrimary}
        disabled={isLoading || !email} // 이메일이 없으면 비활성화
      >
        {isLoading && currentStep === 1 ? "인증번호 전송 중..." : "다음"}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <p className={styles.subtleText}>
        <span className={styles.highlightText}>{email}</span>로 전송된
        인증번호를 입력해주세요
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
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleResendCode} // 재전송 버튼 클릭 핸들러
            className={styles.buttonSecondary}
            disabled={isLoading}
          >
            {isLoading && currentStep === 2 ? "재전송 중..." : "재전송"}
          </button>
        </div>
      </div>
      {timeLeft > 0 ? (
        <div className={styles.timerText}>
          남은 시간: {formatTime(timeLeft)}
        </div>
      ) : (
        <div className={styles.timerExpiredText}>
          인증번호 유효 시간이 만료되었습니다.
        </div>
      )}
      {error && <p className={styles.errorMessage}>{error}</p>}{" "}
      {/* 에러 메시지 표시 */}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevStep}
          className={styles.buttonSecondary}
          disabled={isLoading}
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleNextStep}
          className={styles.buttonPrimary}
          disabled={isLoading || !verificationCode || timeLeft === 0} // 인증번호, 타이머 확인
        >
          {isLoading && currentStep === 2 ? "인증 확인 중..." : "인증확인"}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <form onSubmit={handleSubmitNewPassword} className={styles.stepContent}>
      {" "}
      {/* 새로운 핸들러 */}
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
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className={styles.togglePasswordButton}
            aria-label={showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            disabled={isLoading}
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
      <div className={styles.rulesBox}>
        <h4>비밀번호 규칙</h4>
        <ul>
          <li>• 8자 이상 16자 이하</li>
          <li>• 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합</li>
          <li>• 연속된 문자나 숫자 3개 이상 사용 금지</li>
          <li>• 아이디와 동일하거나 포함된 비밀번호 사용 금지</li>
        </ul>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}{" "}
      {/* 에러 메시지 표시 */}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevStep}
          className={styles.buttonSecondary}
          disabled={isLoading}
        >
          이전
        </button>
        <button
          type="submit"
          className={styles.buttonPrimary}
          disabled={
            isLoading ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
          } // 새 비밀번호 입력, 일치 여부 확인
        >
          {isLoading ? "비밀번호 변경 중..." : "비밀번호 변경"}
        </button>
      </div>
    </form>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <h1>비밀번호 찾기</h1>
          </div>
          <div className={styles.headerRight}>
            <h2>MUSINSSAK</h2>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
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
      </div>

      <div className={styles.footer}>
        <div className={styles.footerInner}>
          <p>고객센터: 1588-0000 | 평일 09:00~18:00 (주말/공휴일 휴무)</p>
          <p>&copy; 2024 MUSINSSAK. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default FindPassword;
