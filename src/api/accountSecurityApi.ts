import { api } from "../lib/axios";

// 비밀번호 변경 요청/응답 타입
type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};
type ChangePasswordData = {
  lastModifiedDate: string;
};

// 비밀번호 마지막 변경일 조회 응답 타입
type PasswordLastModifiedData = {
  lastModifiedDate: string;
};

// 비밀번호 변경
export async function changePassword(
  body: ChangePasswordBody,
): Promise<ChangePasswordData> {
  const res = await api.put("/users/me/password", body);

  // 데이터를 항상 { lastModifiedDate: "날짜" } 형태로 통일(정규화)합니다.
  const raw = res.data.data;
  const lastModifiedDate =
    typeof raw === "string"
      ? raw
      : (raw?.lastModifiedDate as string | undefined);

  // lastModifiedDate 값이 정상적으로 확보되었는지 확인합니다.
  if (!lastModifiedDate) {
    throw new Error("Invalid response: lastModifiedDate missing");
  }

  // 항상 동일한 형태의 객체로 반환합니다.
  return { lastModifiedDate };
}

// 초기 진입시 비밀번호 마지막 변경일 조회
export async function getPasswordLastModified(): Promise<PasswordLastModifiedData> {
  const res = await api.get("/users/me/password/last-modified");

  return res.data.data as PasswordLastModifiedData;
}
