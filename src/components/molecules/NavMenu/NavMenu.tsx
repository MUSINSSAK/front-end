import { NavButton } from "../../atoms";
import styles from "./NavMenu.module.css";

type Props = {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
};

export default function NavMenu({ categories, selected, onSelect }: Props) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        <NavButton
          label="전체"
          isActive={selected === "전체"}
          onClick={() => onSelect("전체")}
        />

        {categories.map((cat) => (
          <NavButton
            key={cat}
            label={cat}
            isActive={selected === cat}
            onClick={() => onSelect(cat)}
          />
        ))}
      </div>
    </nav>
  );
}
