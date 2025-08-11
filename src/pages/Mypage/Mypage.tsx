import { useState } from "react";
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

const Mypage = () => {
  const [selected, setSelected] = useState("profile");
  return (
    <div>
      <MypageTemplate activeKey={selected} onSelect={setSelected}>
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
    </div>
  );
};

export default Mypage;
