import { CATEGORIES } from "../../../constants/categories";
import { useAuthStore } from "../../../store/authStore";
import { Logo } from "../../atoms";
import { AuthNav, NavMenu, SearchBar, UserNav } from "../../molecules";
import styles from "./Header.module.css";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

export default function Header({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: HeaderProps) {
  const { accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;

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

        <div className={styles.rightMenu}>
          {isLoggedIn ? <UserNav /> : <AuthNav />}
        </div>
      </div>

      <NavMenu
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </header>
  );
}
