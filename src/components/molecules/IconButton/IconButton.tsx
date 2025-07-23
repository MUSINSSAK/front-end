import type { LucideIcon } from "lucide-react";
import { Badge } from "../../atoms";
import styles from "./IconButton.module.css";

type IconButtonProps = {
  icon: LucideIcon;
  size?: number;
  count?: number;
  onClick: () => void;
};

export default function IconButton({
  icon: Icon,
  size,
  count,
  onClick,
}: IconButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <Icon size={size} />
      {typeof count === "number" && <Badge count={count} />}
    </button>
  );
}
