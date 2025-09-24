import styles from "./TabNav.module.css";

type Props = {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
};

export default function TabNav({ tabs, active, onChange }: Props) {
  return (
    <nav className={styles.nav}>
      {tabs.map((t) => (
        <button
          type="button"
          key={t}
          onClick={() => onChange(t)}
          className={`${styles.tab} ${active === t ? styles.active : ""}`}
        >
          {t}
        </button>
      ))}
    </nav>
  );
}
