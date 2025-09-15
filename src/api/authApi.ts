import { api } from "../lib/axios";

// 로그인 요청 시 서버로 보낼 데이터의 타입
type LoginBody = {
  email: string;
  password: string;
};

// 로그인 성공 시 서버로부터 받을 `data` 객체의 타입
type LoginData = {
  userId: string;
  accessToken: string;
};

// 회원가입 요청 시 서버로 보낼 데이터의 타입 (명세서 기반)
type RegisterBody = {
  email: string;
  password: string;
  nickname: string;
};

// 회원가입 성공 시 서버로부터 받을 응답 (data 필드는 없음)
type RegisterData = {
  message: string;
};

// 비밀번호 찾기 1단계: 인증번호 요청
type PasswordRequestCodeBody = {
  email: string;
};
type PasswordRequestCodeData = {
  message: string;
};

// 비밀번호 찾기 2단계: 인증번호 확인
type PasswordVerifyCodeBody = {
  email: string;
  code: string;
};
type PasswordVerifyCodeData = {
  message: string;
};

// 비밀번호 찾기 3단계: 비밀번호 재설정
type PasswordResetBody = {
  email: string;
  newPassword: string;
};
type PasswordResetData = {
  message: string;
};

// 2. 로그인 API 함수
export async function login(body: LoginBody): Promise<LoginData> {
  const res = await api.post("/auth/login", body);
  return res.data.data as LoginData;
}

// 3. 회원가입 API 함수
export async function register(body: RegisterBody): Promise<RegisterData> {
  const res = await api.post("/auth/register", body);
  return { message: res.data.message };
}

// 4. 비밀번호 찾기 1단계: 인증번호 요청
export async function requestPasswordResetCode(
  body: PasswordRequestCodeBody,
): Promise<PasswordRequestCodeData> {
  const res = await api.post("/auth/password/request", body);
  return { message: res.data.message };
}

// 5. 비밀번호 찾기 2단계: 인증번호 확인
export async function verifyPasswordResetCode(
  body: PasswordVerifyCodeBody,
): Promise<PasswordVerifyCodeData> {
  const res = await api.post("/auth/password/verify", body);
  return { message: res.data.message };
}

// 6. 비밀번호 찾기 3단계: 비밀번호 재설정
export async function resetPassword(
  body: PasswordResetBody,
): Promise<PasswordResetData> {
  const res = await api.post("/auth/password/reset", body);
  return { message: res.data.message };
}
