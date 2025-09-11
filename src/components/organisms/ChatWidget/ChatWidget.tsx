import { MessagesSquare, Send, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type { Message } from "../../../types/types";
import { Input } from "../../atoms";
import styles from "./ChatWidget.module.css";

export default function ChatWidget() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "안녕하세요! 무엇을 도와드릴까요?", isUser: false },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const nextId = messages.length
      ? Math.max(...messages.map((m) => m.id)) + 1
      : 1;
    setMessages([
      ...messages,
      { id: nextId, text: newMessage, isUser: true },
      {
        id: nextId + 1,
        text: "죄송합니다. 지금은 상담이 불가능합니다. 상담원 연결은 평일 09:00~18:00에 가능합니다.",
        isUser: false,
      },
    ]);
    setNewMessage("");
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
          <div className={styles.header}>MUSINSSAK 상담</div>
          <div className={styles.messages}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.msg} ${m.isUser ? styles.user : styles.bot}`}
              >
                {m.text}
              </div>
            ))}
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
