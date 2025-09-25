import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile } from "../../../api/profile"; // 프로필 조회, 수정 API 불러오기
import { formatPhoneInput } from "../../../utils/format"; // 휴대폰 하이픈 공통 함수
import { Avatar, Input } from "../../atoms";
import styles from "./ProfileSection.module.css";

export default function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const inputEl = useRef<HTMLInputElement | null>(null);

  // UI에서 쓰는 키로 상태 정의 (profileImage, birthdate)
  const [userInfo, setUserInfo] = useState({
    profileImage: "",
    name: "",
    email: "",
    phone: "",
    birthdate: "",
  });

  // 마운트 시 프로필 조회 → 서버 키를 UI 키로 매핑
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile(); // 서버 키: profileImageUrl, birthDate
        // console.log("[getProfile] raw:", data); // 콘솔로 값 확인
        setUserInfo({
          profileImage: data.profileImageUrl ?? "", // 서버 → UI 매핑
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          birthdate: data.birthDate ?? "",
        });
      } catch (e) {
        console.error("프로필 조회 실패:", e);
      }
    })();
  }, []);

  // 휴대폰 번호 입력 시 자동으로 "-" 추가
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatPhoneInput(e.target.value); // 공통 포맷터
    setUserInfo((prev) => ({ ...prev, phone: value }));
  };

  // 수정 저장 시 API 요청 보내기
  const onSaveChanges = async () => {
    try {
      // 휴대폰 번호 포맷 처리 (기존 포맷에서 "_" 추가)
      const updatedPhone = userInfo.phone.replace(/-/g, "-");

      const updatedData = {
        name: userInfo.name,
        phone: updatedPhone, // 포맷 처리된 전화번호
        birthDate: userInfo.birthdate,
        profileImageUrl: userInfo.profileImage, // 프로필 이미지 URL
      };

      // 프로필 수정 API 호출
      await updateProfile(updatedData);
      alert("프로필 정보가 성공적으로 수정되었습니다!");

      // 수정 모드 종료
      setIsEditing(false); // 수정 후 저장하면 수정 모드 종료
    } catch (e) {
      console.error("프로필 수정 실패:", e);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo((prev) => ({
          ...prev,
          profileImage: reader.result as string, // 업로드된 이미지로 상태 업데이트
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h3>프로필 정보</h3>
        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              onSaveChanges(); // 수정 후 저장
            } else {
              setIsEditing((prev) => !prev); // 수정 모드로 전환
            }
          }}
          className={styles.editBtn}
        >
          {isEditing ? "저장" : "수정"}
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.avatarWrapper}>
          <Avatar
            src={userInfo.profileImage}
            color="#9ca3af"
            className={styles.avatar}
          />
          {isEditing && (
            <label className={styles.cameraLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className={styles.hidden}
                ref={inputEl}
              />
              <Camera size={12} />
            </label>
          )}
        </div>
        <div className={styles.container}>
          {["이름", "이메일", "휴대폰 번호", "생년월일"].map(
            (labelText, idx) => {
              const typeMap = ["text", "email", "tel", "date"] as const;
              const keyMap = ["name", "email", "phone", "birthdate"] as const;
              return (
                <div key={labelText} className={styles.field}>
                  <label className={styles.label} htmlFor={`field-${idx}`}>
                    {labelText}
                  </label>
                  <Input
                    id={`field-${idx}`}
                    type={typeMap[idx]}
                    value={userInfo[keyMap[idx]]}
                    className={styles.input}
                    onChange={(e) => {
                      // 이메일 필드는 수정할 수 없게 처리
                      if (keyMap[idx] === "email") {
                        return; // 이메일 수정 방지
                      }
                      // 휴대폰 번호만 포맷 적용
                      if (keyMap[idx] === "phone") {
                        handlePhoneChange(e);
                      } else {
                        setUserInfo((prev) => ({
                          ...prev,
                          [keyMap[idx]]: e.target.value,
                        }));
                      }
                    }}
                    disabled={!isEditing || keyMap[idx] === "email"} // 이메일 수정 불가
                  />
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
