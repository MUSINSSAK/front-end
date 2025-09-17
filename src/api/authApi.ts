import { api } from "../lib/axios";

// message만 반환하는 모든 함수의 반환 타입
type ApiSuccessMessage = {
  message: string;
};

// 로그인 요청 시 서버로 보낼 데이터의 타입
type LoginBody = {
  email: string;
  password: string;
};

// 회원가입 요청 시 서버로 보낼 데이터의 타입
type RegisterBody = {
  email: string;
  password: string;
  nickname: string;
};

// 비밀번호 찾기 1단계: 인증번호 요청
type PasswordRequestCodeBody = {
  email: string;
};

// 비밀번호 찾기 2단계: 인증번호 확인
type PasswordVerifyCodeBody = {
  email: string;
  code: string;
};

// 비밀번호 찾기 3단계: 비밀번호 재설정
type PasswordResetBody = {
  email: string;
  newPassword: string;
};

// 로그인 성공 시 서버로부터 받을 `data` 객체의 타입
type LoginData = {
  userId: string;
  accessToken: string;
};

//  로그인 API 함수
export async function login(body: LoginBody): Promise<LoginData> {
  const res = await api.post("/auth/login", body);
  return res.data.data as LoginData;
}

// 회원가입 API 함수
export async function register(body: RegisterBody): Promise<ApiSuccessMessage> {
  const res = await api.post("/auth/register", body);
  return { message: res.data.message };
}

// 4. 비밀번호 찾기 1단계: 인증번호 요청
export async function requestPasswordResetCode(
  body: PasswordRequestCodeBody,
): Promise<ApiSuccessMessage> {
  const res = await api.post("/auth/password/request", body);
  return { message: res.data.message };
}

// 5. 비밀번호 찾기 2단계: 인증번호 확인
export async function verifyPasswordResetCode(
  body: PasswordVerifyCodeBody,
): Promise<ApiSuccessMessage> {
  const res = await api.post("/auth/password/verify", body);
  return { message: res.data.message };
}

// 6. 비밀번호 찾기 3단계: 비밀번호 재설정
export async function resetPassword(
  body: PasswordResetBody,
): Promise<ApiSuccessMessage> {
  const res = await api.post("/auth/password/reset", body);
  return { message: res.data.message };
}
