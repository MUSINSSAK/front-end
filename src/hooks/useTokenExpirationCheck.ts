import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../api/auth";
import { useModal } from "../contexts/ModalContext";

const EXPIRATION_THRESHOLD = 10 * 60 * 1000;

export function useTokenExpirationCheck() {
  const { confirm } = useModal();
  const navigate = useNavigate();
  const isHandlingSession = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const forceLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }, [navigate]);

  const handleSession = useCallback(async () => {
    if (isHandlingSession.current) return;
    isHandlingSession.current = true;

    const shouldExtend = await confirm({
      title: "로그인 연장",
      description: "세션이 곧 만료됩니다. 로그인을 30분 연장하시겠습니까?",
      confirmText: "연장",
      cancelText: "취소",
    });

    if (shouldExtend) {
      try {
        const { accessToken: newAccessToken } = await refreshAccessToken();
        localStorage.setItem("accessToken", newAccessToken);
      } catch (error) {
        console.error("세션 연장 실패:", error);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        forceLogout();
      }
    } else {
      forceLogout();
    }

    isHandlingSession.current = false;
  }, [confirm, forceLogout]);

  useEffect(() => {
    const checkToken = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      try {
        const decodedToken = jwtDecode<{ exp: number }>(accessToken);
        const timeRemaining = decodedToken.exp * 1000 - Date.now();

        if (timeRemaining <= 0) {
          alert("세션이 만료되어 자동으로 로그아웃됩니다.");
          forceLogout();
          if (intervalRef.current) clearInterval(intervalRef.current);
          return;
        }

        if (timeRemaining < EXPIRATION_THRESHOLD) {
          handleSession();
        }
      } catch (error) {
        console.error("유효하지 않은 토큰:", error);
        forceLogout();
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    const intervalId = setInterval(checkToken, 30 * 1000);
    intervalRef.current = intervalId;

    return () => {
      clearInterval(intervalId);
    };
  }, [handleSession, forceLogout]);
}
