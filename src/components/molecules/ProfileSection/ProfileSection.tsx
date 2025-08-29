import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, Input } from "../../atoms";
import styles from "./ProfileSection.module.css";

export default function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [userInfo, setUserInfo] = useState({
    profileImage: "",
    name: "홍길동",
    email: "example@example.com",
    phone: "010-1234-5678",
    birthdate: "1990-01-01",
  });

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo((prev) => ({
          ...prev,
          profileImage: reader.result as string,
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
          onClick={() => setIsEditing((prev) => !prev)}
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
                    onChange={(e) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        [keyMap[idx]]: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
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
