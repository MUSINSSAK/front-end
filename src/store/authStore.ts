import { create } from "zustand";
import { logout as logoutApi } from "../api/authApi";

type AuthState = {
  userId: string | null;
  accessToken: string | null;
  setAuth: (accessToken: string, userId: string) => void;
  logout: () => Promise<void>;
  isInitialized: boolean;
  initialize: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  accessToken: localStorage.getItem("accessToken"), // 페이지 로드 시 localStorage에서 토큰을 가져와 초기화
  isInitialized: false,
  setAuth: (accessToken, userId) => {
    localStorage.setItem("accessToken", accessToken);
    set({ accessToken, userId });
  },
  logout: async () => {
    try {
      // 1. 서버에 로그아웃 요청을 보내 Refresh Token을 무효화합니다.
      await logoutApi();
    } catch (error) {
      console.error("서버 로그아웃에 실패했습니다.", error);
    } finally {
      // 2. API 성공 여부와 관계없이 클라이언트의 상태를 모두 초기화합니다.
      localStorage.removeItem("accessToken");
      set({ accessToken: null, userId: null });
      // 로그아웃 후 메인 페이지로 이동
      window.location.href = "/";
    }
  },
  initialize: () => {
    set({ isInitialized: true });
  },
}));
