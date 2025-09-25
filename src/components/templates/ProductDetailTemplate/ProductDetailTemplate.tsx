import { StickyActionBar } from "../../organisms";
import styles from "./ProductDetailTemplate.module.css";

type Props = {
  children: React.ReactNode; // 스크롤 되는 본문
  cartCount: number;
  onAddCart: () => void;
};

export default function ProductDetailTemplate({
  children,
  cartCount,
  onAddCart,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>{children}</div>
      {/* 푸터 느낌의 하단 고정 바 */}
      <StickyActionBar cartCount={cartCount} onAddCart={onAddCart} />
    </div>
  );
}
