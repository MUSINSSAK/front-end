import { Heart, ShoppingCart } from "lucide-react";
import { CATEGORIES } from "../../../constants/categories";
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
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </header>
  );
}
