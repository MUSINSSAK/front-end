import { type ReactNode, useState } from "react";
import { useCategory } from "../../../contexts/CategoryContext";
import { Banner } from "../../molecules";
import { Header, HomeFooter } from "../../organisms";

type Props = {
  children: ReactNode;
};

export default function MainTemplate({ children }: Props) {
  const { selected, setSelected } = useCategory();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Banner text="신규 회원 가입 시 20% 할인 쿠폰 증정 | 무료배송 5만원 이상" />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selected}
        setSelectedCategory={setSelected}
      />

      <main>{children}</main>

      <HomeFooter />
    </>
  );
}
