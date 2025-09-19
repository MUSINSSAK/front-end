import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    // localStorage에서 accessToken을 가져옵니다.
    const accessToken = localStorage.getItem("accessToken");

    // 토큰이 존재하면, 모든 요청 헤더에 Authorization을 추가합니다.
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  },
);
