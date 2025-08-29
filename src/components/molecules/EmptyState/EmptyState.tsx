import { type LucideIcon, ShoppingCart } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../atoms";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.emptyState}>
      <div className={styles.iconWrapper}>{React.createElement(icon)}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <Button
        type="button"
        variant="active"
        className={styles.button}
        onClick={() => navigate("/")}
      >
        <ShoppingCart size={15} />
        <span>쇼핑하러 가기</span>
      </Button>
    </div>
  );
}
