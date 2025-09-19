import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../api/authApi";
import type { User } from "../types/types";

type AuthState = {
  isLoggedIn: boolean;
  user?: User;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  wishlistCount: number;
  cartCount: number;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | undefined>();
  const navigate = useNavigate();

  // 1. localStorage에서 토큰을 읽어와 accessToken 상태의 초기값으로 설정합니다.
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );

  // 2. isLoggedIn 상태는 accessToken의 존재 여부에 따라 결정됩니다.
  const isLoggedIn = !!accessToken;

  // 기존 카운트 상태는 유지
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // 3. 로그인 함수를 수정합니다.
  //    토큰과 사용자 정보를 받아 localStorage와 상태에 모두 저장합니다.
  const login = (token: string, userData: User) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    setUser(userData);
    // TODO: 로그인 후 위시리스트/장바구니 개수 불러오는 API 호출
    // setWishlistCount(fetchedWishlist);
    // setCartCount(fetchedCart);
  };

  // 4. 로그아웃 함수를 실제로직으로 구현합니다.
  const logout = useCallback(async () => {
    if (!window.confirm("로그아웃하시겠습니까?")) {
      return;
    }
    try {
      // 서버에 로그아웃 요청을 보내 Refresh Token을 무효화합니다.
      await logoutApi();
    } catch (error) {
      console.error("서버 로그아웃 요청에 실패했습니다.", error);
    } finally {
      // API 성공 여부와 관계없이 클라이언트의 모든 인증 정보를 삭제합니다.
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(undefined);
      setWishlistCount(0);
      setCartCount(0);
      // 로그아웃 후 홈으로 이동합니다.
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const syncLoginState = () => {
      setAccessToken(localStorage.getItem("accessToken"));
    };
    window.addEventListener("storage", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, wishlistCount, cartCount, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
