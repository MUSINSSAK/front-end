import { type FormEvent, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ChatWidget } from "./components/organisms";
import { MainTemplate } from "./components/templates";
import { AuthProvider } from "./contexts/AuthContext";
import { Category } from "./pages";
import Home from "./pages/Home/Home";
import type { Message } from "./types";

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  return (
    <AuthProvider>
      <MainTemplate
        searchQuery=""
        setSearchQuery={() => {}}
        selectedCategory="all"
        setSelectedCategory={() => {}}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="category/:cat" element={<Category />} />
        </Routes>

        <ChatWidget
          isOpen={isChatOpen}
          messages={messages}
          newMessage={newMessage}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          onChange={setNewMessage}
          onSend={handleSendMessage}
        />
      </MainTemplate>
    </AuthProvider>
  );
}
