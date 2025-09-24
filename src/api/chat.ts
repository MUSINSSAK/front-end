import { api } from "../lib/axios";
import type { Product } from "../types/chat";

type ChatResponseData = {
  chatbotMessage: string;
  recommendedProducts: Product[];
};

/**
 * 챗봇 메시지를 백엔드로 전송하고 AI의 응답을 받아오는 함수
 * @param query 사용자가 입력한 메시지
 * @returns AI가 생성한 답변 데이터
 */
export async function postChatMessage(
  query: string,
): Promise<ChatResponseData> {
  const res = await api.post(
    "/chat", // 👈 baseURL이 빠진 상대 경로만 사용
    { query }, // Request Body
  );

  // 👈 mainProducts.ts와 동일한 데이터 반환 구조
  return res.data; // as ChatResponseData;
}
