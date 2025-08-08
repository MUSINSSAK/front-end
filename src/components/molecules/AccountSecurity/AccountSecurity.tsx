import { useState } from "react";
import { Button } from "../../atoms";
import styles from "./AccountSecurity.module.css";

export default function AccountSecurity() {
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const onChangePassword = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Password changed", passwords);
    setShowPasswordForm(false);
    // TODO: 실제 변경 로직 호출
  };

  const isFormValid =
    passwords.current.trim() !== "" &&
    passwords.next.trim() !== "" &&
    passwords.confirm.trim() !== "";

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>계정 보안</h3>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <h4 className={styles.rowInfoTitle}>비밀번호</h4>
            <p className={styles.rowInfoSubtitle}>
              마지막 변경: 2024년 6월 15일
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setShowPasswordForm((s) => !s)}
            className={styles.toggleButton}
          >
            변경
          </Button>
        </div>
        {showPasswordForm && (
          <div className={styles.form}>
            {[
              { label: "현재 비밀번호", key: "current" },
              { label: "새 비밀번호", key: "next" },
              { label: "새 비밀번호 확인", key: "confirm" },
            ].map(({ label, key }, idx) => {
              const inputId = `password-field-${idx}`;
              return (
                <div key={key} className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor={inputId}>
                    {label}
                  </label>
                  <input
                    id={inputId}
                    type="password"
                    className={styles.formInput}
                    value={passwords[key as keyof typeof passwords]}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              );
            })}
            <div className={styles.formActions}>
              <Button
                type="submit"
                variant={isFormValid ? "active" : "disabled"}
                className={`${styles.actionButton} ${styles.primary}`}
                onClick={onChangePassword}
              >
                변경하기
              </Button>
              <Button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className={`${styles.actionButton} ${styles.secondary}`}
              >
                취소
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
