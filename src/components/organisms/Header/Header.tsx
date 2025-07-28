import { Heart, ShoppingCart } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { Logo } from "../../atoms";
import {
  AuthNav,
  IconButton,
  NavMenu,
  SearchBar,
  UserMenu,
} from "../../molecules";
import styles from "./Header.module.css";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: HeaderProps) {
  const { isLoggedIn, user, wishlistCount, cartCount } = useAuth();

  const categories = [
    { id: "all", name: "전체" },
    { id: "beauty", name: "뷰티" },
    { id: "shoes", name: "신발" },
    { id: "tops", name: "상의" },
    { id: "outerwear", name: "아우터" },
    { id: "pants", name: "바지" },
    { id: "dresses", name: "원피스/스커트" },
    { id: "bags", name: "가방" },
    { id: "accessories", name: "패션소품" },
    { id: "loungewear", name: "속옷/홈웨어" },
    { id: "sports", name: "스포츠/레저" },
    { id: "digital", name: "디지털/라이프" },
    { id: "kids", name: "키즈" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Logo />

        <SearchBar
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />

        {isLoggedIn ? (
          <div className={styles.rightMenu}>
            <UserMenu userName={user?.name ?? ""} />
            <IconButton
              icon={Heart}
              size={20}
              count={wishlistCount}
              onClick={() => {
                /* handle wishlist click */
              }}
            />
            <IconButton
              icon={ShoppingCart}
              size={20}
              count={cartCount}
              onClick={() => {
                /* handle cart click */
              }}
            />
          </div>
        ) : (
          <AuthNav />
        )}
      </div>

      <NavMenu
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </header>
  );
}
