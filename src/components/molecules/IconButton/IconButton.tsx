import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../atoms";
import styles from "./IconButton.module.css";

type IconButtonProps = {
  icon: LucideIcon;
  size?: number;
  count?: number;
  to: string;
};

export default function IconButton({
  icon: Icon,
  size,
  count,
  to,
}: IconButtonProps) {
  return (
    <Link to={to} className={styles.button}>
      <Icon size={size} />
      {typeof count === "number" && <Badge count={count} />}
    </Link>
  );
}
