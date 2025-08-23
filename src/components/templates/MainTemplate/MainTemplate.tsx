import { type ReactNode, useState } from "react";
import { useCategory } from "../../../contexts/CategoryContext";
import { Banner } from "../../molecules";
import { Header, HomeFooter } from "../../organisms";
import styles from "./MainTemplate.module.css";

type Props = {
  children: ReactNode;
};

export default function MainTemplate({ children }: Props) {
  const { selected, setSelected } = useCategory();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.container}>
      <Banner text="신규 회원 가입 시 20% 할인 쿠폰 증정 | 무료배송 5만원 이상" />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selected}
        setSelectedCategory={setSelected}
      />

      <main className={styles.main}>{children}</main>

      <HomeFooter />
    </div>
  );
}
