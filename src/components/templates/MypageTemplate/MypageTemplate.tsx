import {
  BriefcaseBusiness,
  CircleQuestionMark,
  Coins,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Ticket,
  User,
} from "lucide-react";
import type React from "react";
import { SidebarMenu } from "../../molecules";
import styles from "./MypageTemplate.module.css";

export type MyPageTemplateProps = {
  activeKey: string;
  onSelect: (key: string) => void;
  children: React.ReactNode;
};

export default function MypageTemplate({
  activeKey,
  onSelect,
  children,
}: MyPageTemplateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <SidebarMenu
            sections={[
              {
                category: "내 정보",
                items: [{ key: "profile", label: "개인정보 수정", icon: User }],
              },
              {
                category: "주문/배송",
                items: [
                  { key: "order", label: "주문내역", icon: BriefcaseBusiness },
                ],
              },
              {
                category: "나의 쇼핑",
                items: [
                  { key: "wishlist", label: "찜한상품", icon: Heart },
                  { key: "recent", label: "최근 본 상품", icon: Eye },
                  { key: "review", label: "상품리뷰", icon: Star },
                ],
              },
              {
                category: "혜택관리",
                items: [
                  { key: "coupons", label: "쿠폰함", icon: Ticket },
                  { key: "points", label: "적립금", icon: Coins },
                ],
              },
              {
                category: "고객센터",
                items: [
                  { key: "inquiry", label: "1:1 문의", icon: MessageCircle },
                  {
                    key: "faq",
                    label: "자주 묻는 질문",
                    icon: CircleQuestionMark,
                  },
                ],
              },
            ]}
            activeKey={activeKey}
            onSelect={onSelect}
          />
        </aside>
        <div className={styles.main}>{children}</div>
      </div>
    </div>
  );
}
