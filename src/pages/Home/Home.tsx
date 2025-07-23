import type React from "react";
import { useState } from "react";
import { HomeTemplate } from "../../components/templates";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = true; // 예시 데이터
  const userName = "김민수"; // 예시 데이터
  const cartCount = 3; // 예시 데이터
  const [selectedCategory, setSelectedCategory] = useState("");
  const wishlist = [
    { id: 1, name: "에어맥스 270 스니커즈", brand: "NIKE" },
    { id: 2, name: "오버사이즈 블레이저", brand: "ZARA" },
  ]; // 예시 데이터

  return (
    <div>
      <HomeTemplate
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoggedIn={isLoggedIn}
        userName={userName}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      >
        <div></div>
      </HomeTemplate>
    </div>
  );
};

export default Home;
