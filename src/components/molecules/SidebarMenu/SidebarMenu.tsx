import type { LucideIcon } from "lucide-react";
import styles from "./SidebarMenu.module.css";

type MenuItem = {
  key: string;
  label: string;
  icon: LucideIcon;
};

type SidebarMenuProps = {
  sections: { category: string; items: MenuItem[] }[];
  activeKey: string;
  onSelect: (key: string) => void;
};

export default function SidebarMenu({
  sections,
  activeKey,
  onSelect,
}: SidebarMenuProps) {
  return (
    <div className={styles.wrapper}>
      {sections.map((sec) => (
        <div key={sec.category} className={styles.section}>
          <div className={styles.heading}>{sec.category}</div>
          {sec.items.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`${styles.item} ${
                activeKey === item.key ? styles.active : ""
              }`}
              onClick={() => onSelect(item.key)}
            >
              <item.icon className={styles.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
