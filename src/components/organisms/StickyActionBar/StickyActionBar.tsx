import { Button } from "../../atoms";
import styles from "./StickyActionBar.module.css";

type Props = {
  cartCount: number;
  onAddCart: () => void;
};

export default function StickyActionBar({ onAddCart }: Props) {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <Button
            variant="active"
            onClick={onAddCart}
            className={styles.cartButton}
          >
            장바구니 담기
          </Button>

          {/* <Button className={styles.buyButton}>바로 구매하기</Button> */}
        </div>
      </div>
      <div className={styles.spacer} />
    </>
  );
}
