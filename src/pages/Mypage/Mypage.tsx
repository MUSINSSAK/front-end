import { useNavigate, useParams } from "react-router-dom";
import {
  CouponsSection,
  FAQSection,
  InquirySection,
  OrderHistorySection,
  PointsSection,
  ProfileEditSection,
  RecentViewSection,
  ReviewsSection,
  WishListSection,
} from "../../components/organisms";
import { MypageTemplate } from "../../components/templates";

const TABS = [
  "profile",
  "order",
  "wishlist",
  "recent",
  "review",
  "coupons",
  "points",
  "inquiry",
  "faq",
] as const;
type Tab = (typeof TABS)[number];

const isTab = (v: unknown): v is Tab => TABS.includes(v as Tab);

const Mypage = () => {
  const { tab } = useParams<{ tab?: string }>();
  const selected: Tab = isTab(tab) ? (tab as Tab) : "profile";
  const navigate = useNavigate();

  return (
    <MypageTemplate
      activeKey={selected}
      onSelect={(key) => navigate(`/mypage/${key}`)}
    >
      {selected === "profile" && <ProfileEditSection />}
      {selected === "order" && <OrderHistorySection />}
      {selected === "wishlist" && <WishListSection />}
      {selected === "recent" && <RecentViewSection />}
      {selected === "review" && <ReviewsSection />}
      {selected === "coupons" && <CouponsSection />}
      {selected === "points" && <PointsSection />}
      {selected === "inquiry" && <InquirySection />}
      {selected === "faq" && <FAQSection />}
    </MypageTemplate>
  );
};

export default Mypage;
