import { api } from "../lib/axios";

// 타입 정의 (응답 데이터의 형식)
type ProfileData = {
  name: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  profileImageUrl: string | null;
};

// 프로필 조회 함수
export async function getProfile(): Promise<ProfileData> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string; // Vite 방식 (타입 OK)

  if (!accessToken) {
    // 선택: 런타임 보호
    throw new Error("VITE_ACCESS_TOKEN is missing in .env");
  }

  const res = await api.get("/users/me/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 서버 공통 포맷: { status, code, message, data }
  return res.data.data as ProfileData;
}

// 프로필 수정 함수 (PUT 요청)
export async function updateProfile(updatedData: {
  name: string;
  phone: string;
  birthDate: string;
  profileImageUrl: string;
}): Promise<ProfileData> {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN as string;

  if (!accessToken) {
    throw new Error("VITE_ACCESS_TOKEN is missing in .env");
  }

  const res = await api.put("/users/me/profile", updatedData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data.data as ProfileData;
}
