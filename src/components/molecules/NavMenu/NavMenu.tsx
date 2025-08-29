import { NavButton } from "../../atoms";
import styles from "./NavMenu.module.css";

type Props = {
  categories: { id: string; name: string }[];
  selected: string;
  onSelect: (cat: string) => void;
};

export default function NavMenu({ categories, selected, onSelect }: Props) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        {categories.map((cat) => (
          <NavButton
            key={cat.id}
            id={cat.id}
            label={cat.name}
            isActive={selected === cat.name}
            onClick={() => onSelect(cat.name)}
          />
        ))}
      </div>
    </nav>
  );
}
