import type React from "react";
import { useState } from "react";
import { HomeTemplate } from "../../components/templates";
import type { Product } from "../../types";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = false; // 예시 데이터
  const userName = "김민수"; // 예시 데이터
  const cartCount = 3; // 예시 데이터
  const [selectedCategory, setSelectedCategory] = useState("");
  const wishlist: Product[] = []; // 예시 데이터

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
