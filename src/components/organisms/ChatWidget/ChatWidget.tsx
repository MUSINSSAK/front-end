import { MessagesSquare, Send, X } from "lucide-react";
import { type FormEvent, useEffect, useRef } from "react";
import type { Message } from "../../../types";
import { Input } from "../../atoms";
import styles from "./ChatWidget.module.css";

type Props = {
  isOpen: boolean;
  messages: Message[];
  newMessage: string;
  onToggle: () => void;
  onChange: (v: string) => void;
  onSend: (e: FormEvent) => void;
};

export default function ChatWidget({
  isOpen,
  messages,
  newMessage,
  onToggle,
  onChange,
  onSend,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional non-exhaustive deps for scroll behavior
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <>
      <button type="button" className={styles.button} onClick={onToggle}>
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
          <form onSubmit={onSend} className={styles.form}>
            <Input
              value={newMessage}
              onChange={(e) => onChange(e.target.value)}
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
