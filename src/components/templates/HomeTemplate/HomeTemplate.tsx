import type React from "react";
import { Banner } from "../../molecules";
import { Header, HomeFooter } from "../../organisms";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  children: React.ReactNode;
};

export default function MainTemplate({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  children,
}: Props) {
  return (
    <>
      <Banner text="신규 회원 가입 시 20% 할인 쿠폰 증정 | 무료배송 5만원 이상" />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <main>{children}</main>
      <HomeFooter />
    </>
  );
}
