import { createContext, type ReactNode, useContext, useState } from "react";
import type { User } from "../types";

interface AuthState {
  isLoggedIn: boolean;
  user?: User;
  wishlistCount: number;
  cartCount: number;
  login: (user: User) => void;
  logout: () => void;
  // 필요하면 카운트 업데이트 함수도 추가
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const login = (userData: User) => {
    setIsLoggedIn(true);
    setUser(userData);
    // 예: 서버에서 counts 받아오기
    // setWishlistCount(fetchedWishlist);
    // setCartCount(fetchedCart);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(undefined);
    setWishlistCount(0);
    setCartCount(0);
  };

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
