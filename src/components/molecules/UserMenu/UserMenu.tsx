import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar className={styles.icon} color="#fff" />
        <span>{userName}님</span>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <Link to="/mypage" className={styles.item} onClick={close}>
            마이페이지
          </Link>
          <Link to="/mypage/order" className={styles.item} onClick={close}>
            주문내역
          </Link>
          <Link to="/mypage/wishlist" className={styles.item} onClick={close}>
            찜한상품
          </Link>
          <Link to="/mypage/coupons" className={styles.item} onClick={close}>
            쿠폰함
          </Link>
          <div className={styles.divider} />
          <Link to="/logout" className={styles.item} onClick={close}>
            로그아웃
          </Link>{" "}
        </div>
      )}
    </div>
  );
}
