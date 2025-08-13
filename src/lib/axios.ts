import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     const status = error.response?.status;
//     if (status === 401) {
//       localStorage.removeItem("accessToken");
//       // TODO: 전역 토스트/스낵바
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );
