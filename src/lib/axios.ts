import axios from "axios";
import { refreshAccessToken } from "../api/auth";

// 1. API 요청을 위한 기본 Axios 인스턴스 생성
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// 2. 요청 인터셉터 (API 요청을 보내기 전에 실행)
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. 응답 인터셉터 (API 응답을 받은 후에 실행)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken: newAccessToken } = await refreshAccessToken();
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
