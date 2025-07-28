import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 스프링부트 서버 주소
        changeOrigin: true, // Origin 헤더를 target에 맞춰줌
        secure: false, // HTTPS 인증 무시 (로컬 개발용)
      },
    },
  },
});
