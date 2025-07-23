import { ContactInfoItem } from "../../atoms";
import { FooterColumn } from "../../molecules";
import styles from "./HomeFooter.module.css";

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <FooterColumn title="MUSINSSAK">
          <p className={styles.description}>
            트렌디하고 스타일리시한 패션을 제안하는 온라인 패션 플랫폼입니다.
          </p>
        </FooterColumn>

        <FooterColumn
          title="고객서비스"
          links={[
            { href: "/notice", label: "공지사항" },
            { href: "/faq", label: "자주묻는질문" },
            { href: "/contact", label: "1:1 문의" },
            { href: "/tracking", label: "배송조회" },
          ]}
        />

        <FooterColumn
          title="쇼핑정보"
          links={[
            { href: "/terms", label: "이용약관" },
            { href: "/privacy", label: "개인정보처리방침" },
            { href: "/exchange", label: "교환/반품" },
            { href: "/shipping", label: "배송정보" },
          ]}
        />

        <FooterColumn title="연락처">
          <ContactInfoItem>고객센터: 1588-0000</ContactInfoItem>
          <ContactInfoItem>평일 09:00~18:00</ContactInfoItem>
          <ContactInfoItem>주말/공휴일 휴무</ContactInfoItem>
          <ContactInfoItem>이메일: help@musinssak.com</ContactInfoItem>
        </FooterColumn>
      </div>

      <div className={styles.footerBottom}>
        &copy; 2024 MUSINSSAK. All rights reserved.
      </div>
    </footer>
  );
}
