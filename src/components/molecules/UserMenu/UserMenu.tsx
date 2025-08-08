import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../../atoms";
import styles from "./UserMenu.module.css";

type UserMenuProps = {
  userName: string;
};

export default function UserMenu({ userName }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={styles.button}
      >
        <Avatar className={styles.icon} color="#fff" />
        <span>{userName}님</span>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <a href="/mypage" className={styles.item}>
            마이페이지
          </a>
          <a href="/order-history" className={styles.item}>
            주문내역
          </a>
          <a href="/wishlist" className={styles.item}>
            찜한상품
          </a>
          <a href="/coupons" className={styles.item}>
            쿠폰함
          </a>
          <div className={styles.divider} />
          <a href="/logout" className={styles.item}>
            로그아웃
          </a>
        </div>
      )}
    </div>
  );
}
