import { MessagesSquare, Send, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { postChatMessage } from "../../../api/chat";
import type { Product } from "../../../types/chat";
import { Input } from "../../atoms";
import styles from "./ChatWidget.module.css";

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  products?: Product[];
};

export default function ChatWidget() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "안녕하세요! 무엇을 도와드릴까요?", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // 👇 2. handleSendMessage 함수 전체를 async/await를 사용하도록 수정
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessageText = newMessage;
    const nextId = messages.length
      ? Math.max(...messages.map((m) => m.id)) + 1
      : 1;

    // 2.1. 사용자 메시지를 화면에 즉시 추가 (UX 향상)
    setMessages((prev) => [
      ...prev,
      { id: nextId, text: userMessageText, isUser: true },
    ]);
    setNewMessage("");

    // 2.2. "답변 생성 중..." 임시 메시지 추가
    const loadingMessageId = nextId + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        text: "답변을 생성하고 있습니다...",
        isUser: false,
      },
    ]);

    try {
      // 2.4. 실제 API 호출
      const responseData = await postChatMessage(userMessageText);
      // // 2.5. API 호출 성공 시, "답변 생성 중..." 메시지를 실제 AI 답변으로 교체
      // setMessages((prev) =>
      //   prev.map((msg) =>
      //     msg.id === loadingMessageId
      //       ? { ...msg, text: responseData.chatbotMessage }
      //       : msg,
      //   ),
      // );
      // --- 이 부분을 아래와 같이 수정합니다 ---
      setMessages((prev) => {
        // 1. "답변 생성 중..." 메시지를 필터링하여 제거
        const newMessages = prev.filter((msg) => msg.id !== loadingMessageId);
        const lastId =
          newMessages.length > 0
            ? Math.max(...newMessages.map((m) => m.id))
            : 0;

        // 2. 추천 상품이 있으면 상품 메시지를 먼저 추가
        if (
          responseData.recommendedProducts &&
          responseData.recommendedProducts.length > 0
        ) {
          newMessages.push({
            id: lastId + 1,
            text: "", // 상품 메시지는 텍스트가 필요 없음
            isUser: false,
            products: responseData.recommendedProducts,
          });
        }

        // 3. AI의 텍스트 답변 메시지를 추가
        newMessages.push({
          id: lastId + 2,
          text: responseData.chatbotMessage,
          isUser: false,
        });

        return newMessages;
      });
      // --- 여기까지 수정 ---
    } catch (error) {
      console.error("챗봇 메시지 전송 오류:", error);
      // 2.6. 에러 발생 시, "답변 생성 중..." 메시지를 에러 메시지로 교체
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
              }
            : msg,
        ),
      );
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional non-exhaustive deps for scroll behavior
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <MessagesSquare size={20} />}
      </button>

      {isOpen && (
        <div className={styles.window}>
          <div className={styles.header}>MUSINSSAK &nbsp;AI</div>
          <div className={styles.messages}>
            {messages.map(
              (m) =>
                // --- 이 부분을 아래 코드로 교체합니다 ---
                // 3.1 메시지에 products가 있고, isUser가 false인 경우 상품 목록을 렌더링
                m.products && !m.isUser ? (
                  <div key={m.id} className={styles.productContainer}>
                    {m.products.map((product) => (
                      <a
                        key={product.productId}
                        href={product.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.productItem}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                          <div className={styles.productBrand}>
                            {product.brandName}
                          </div>
                          <div className={styles.productName}>
                            {product.productName}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  // 3.2 그렇지 않으면 기존의 텍스트 말풍선을 렌더링
                  <div
                    key={m.id}
                    className={`${styles.messageRow} ${
                      m.isUser ? styles.userRow : styles.botRow
                    }`}
                  >
                    {!m.isUser && (
                      <img
                        src="/favicon.svg"
                        alt="chatbot logo"
                        className={styles.avatar}
                      />
                    )}
                    <div
                      className={`${styles.bubble} ${
                        m.isUser ? styles.userBubble : styles.botBubble
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ),
              // --- 여기까지 교체 ---
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className={styles.form}>
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요"
              className={styles.input}
            />
            <button type="submit" className={styles.send}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
