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
  lastModifiedDate: string; // e.g. "2024-06-15"
};

// 비밀번호 변경
export async function changePassword(
  body: ChangePasswordBody,
): Promise<ChangePasswordData> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string;
  if (!accessToken) throw new Error("VITE_ACCESS_TOKEN is missing in .env");

  const res = await api.put("/users/me/password", body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  // 서버 공통 포맷: { status, code, message, data }
  // return res.data.data as ChangePasswordData;

  // 서버가 data를 "문자열" 또는 { lastModifiedDate }로 줄 수 있으니 통일
  const raw = res.data.data;
  const lastModifiedDate =
    typeof raw === "string"
      ? raw
      : (raw?.lastModifiedDate as string | undefined);

  if (!lastModifiedDate) {
    throw new Error("Invalid response: lastModifiedDate missing");
  }
  return { lastModifiedDate }; // 항상 동일한 형태로 반환
}

// 초기 진입시 비밀번호 마지막 변경일 조회
export async function getPasswordLastModified(): Promise<PasswordLastModifiedData> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string;
  if (!accessToken) throw new Error("VITE_ACCESS_TOKEN is missing in .env");

  // 백엔드 엔드포인트 이름은 실제 구현에 맞게 변경하세요.
  const res = await api.get("/users/me/password/last-modified", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data.data as PasswordLastModifiedData;
}
