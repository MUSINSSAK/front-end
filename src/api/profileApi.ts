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
  const res = await api.get("/users/me/profile");

  return res.data.data as ProfileData;
}

// 프로필 수정 함수 (PUT 요청)
export async function updateProfile(updatedData: {
  name: string;
  phone: string;
  birthDate: string;
  profileImageUrl: string;
}): Promise<ProfileData> {
  const res = await api.put("/users/me/profile", updatedData);

  return res.data.data as ProfileData;
}
