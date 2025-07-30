import { User } from "lucide-react";
import styles from "./Avatar.module.css";

export type AvatarProps = {
  src?: string;
  color?: string;
  className?: string;
};

export default function Avatar({ src, color, className }: AvatarProps) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {src ? (
        <img src={src} alt="profile" className={styles.image} />
      ) : (
        <User color={color} />
      )}
    </div>
  );
}
