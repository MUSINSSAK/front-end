import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

import {
  changePassword,
  getPasswordLastModified,
} from "../../../api/accountSecurity"; // 비밀번호 마지막 변경일 가져오는 API와 비밀번호 변경 API
import { Button } from "../../atoms";
import styles from "./AccountSecurity.module.css";

export default function AccountSecurity() {
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [lastModifiedDate, setLastModifiedDate] = useState<string | null>(null); // 서버에서 내려주는 마지막 변경일 저장

  // 비밀번호 마지막 변경일 요청
  useEffect(() => {
    (async () => {
      try {
        const { lastModifiedDate } = await getPasswordLastModified();
        setLastModifiedDate(lastModifiedDate); // 서버 날짜 세팅
      } catch (e) {
        console.error("비밀번호 마지막 변경일 조회 실패:", e);
      }
    })();
  }, []);

  // YYYY-MM-DD → "YYYY년 M월 D일" 포맷
  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${y}년 ${m}월 ${d}일`;
  };

  // 실제 비밀번호 변경 로직 연결 + 프론트 유효성(newPasswordCheck) 검사
  const onChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    // 프론트 유효성: 새 비밀번호/확인 일치 여부 (서버 전송하지 않음)
    if (passwords.next !== passwords.confirm) {
      alert("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next, // confirm은 서버 전송 X
      });

      // 성공 처리: UI 갱신
      setLastModifiedDate(res.lastModifiedDate); // 서버 data.lastModifiedDate 반영
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setShowPasswordForm(false);
      // 입력값 초기화
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err: unknown) {
      const msg = isAxiosError<{ message?: string }>(err)
        ? (err.response?.data?.message ?? "비밀번호 변경에 실패했습니다.")
        : err instanceof Error
          ? err.message
          : "비밀번호 변경에 실패했습니다.";
      alert(msg);
      console.error(err);
    }
  };

  // form 활성화 조건에 '일치 여부' 포함
  const isFormValid =
    passwords.current.trim() !== "" &&
    passwords.next.trim() !== "" &&
    passwords.confirm.trim() !== "" &&
    passwords.next === passwords.confirm;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>계정 보안</h3>
      <div className={styles.section}>
        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <h4 className={styles.rowInfoTitle}>비밀번호</h4>
            <p className={styles.rowInfoSubtitle}>
              {/* 서버 응답의 마지막 변경일 표시(없으면 기존 고정 문구 유지 가능) */}
              마지막 변경:{" "}
              {lastModifiedDate ? formatDate(lastModifiedDate) : ""}
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
          <form className={styles.form} onSubmit={onChangePassword}>
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
          </form>
        )}
      </div>
    </div>
  );
}
