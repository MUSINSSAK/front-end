import { Heart, ShoppingCart } from "lucide-react";
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
  isLoggedIn: boolean;
  userName: string;
  wishlistCount: number;
  cartCount: number;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  isLoggedIn,
  userName,
  wishlistCount,
  cartCount,
  selectedCategory,
  setSelectedCategory,
}: HeaderProps) {
  const categories = [
    "뷰티",
    "신발",
    "상의",
    "아우터",
    "바지",
    "원피스/스커트",
    "가방",
    "패션소품",
    "속옷/홈웨어",
    "스포츠/레저",
    "디지털/라이프",
    "키즈",
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Logo />

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {isLoggedIn ? (
          <div className={styles.rightMenu}>
            <UserMenu userName={userName} />
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
