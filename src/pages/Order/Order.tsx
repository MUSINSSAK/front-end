import type React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Order.module.css";

type OrderItem = {
  id: number;
  brand: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
};

type Coupon = {
  id: string;
  name: string;
  discountRate: number;
  discountAmount: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  validUntil: string;
  description: string;
};

const fmt = (n: number) =>
  n.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

const MIN_POINT_USE = 0;

const Order: React.FC = () => {
  const nav = useNavigate();

  const [orderItems] = useState<OrderItem[]>([
    {
      id: 1,
      brand: "NIKE",
      name: "에어맥스 270 스니커즈",
      size: "250",
      price: 159000,
      quantity: 1,
      image:
        "https://readdy.ai/api/search-image?query=nike%20air%20max%20270%20white%20sneakers%20side%20view%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=order1&orientation=squarish",
    },
    {
      id: 2,
      brand: "ADIDAS",
      name: "스탠 스미스 스니커즈",
      size: "245",
      price: 109000,
      quantity: 2,
      image:
        "https://readdy.ai/api/search-image?query=white%20leather%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=order2&orientation=squarish",
    },
  ]);
  const [showOrderItems, setShowOrderItems] = useState(false);

  // ===== 배송지 정보 =====
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    recipient: "",
    phone: "",
    address: "",
    detailAddress: "",
    deliveryRequest: "직접 수령",
  });

  // 주소 검색 모달
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: number; address: string; detail: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAddressSearch = async () => {
    if (!searchKeyword.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const mockResults = searchKeyword.includes("강남")
        ? [
            {
              id: 1,
              address: "서울특별시 강남구 테헤란로 152",
              detail: "(역삼동, 강남파이낸스센터)",
            },
            {
              id: 2,
              address: "서울특별시 강남구 테헤란로 129",
              detail: "(역삼동, 강남N타워)",
            },
            {
              id: 3,
              address: "서울특별시 강남구 테헤란로 142",
              detail: "(역삼동, 캐피탈타워)",
            },
          ]
        : [];
      setSearchResults(mockResults);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressSelect = (address: string) => {
    setDeliveryInfo((p) => ({ ...p, address }));
    setIsAddressModalOpen(false);
    setSearchKeyword("");
    setHasSearched(false);
    setSearchResults([]);
  };

  // ===== 주문자 정보 =====
  const [ordererInfo, setOrdererInfo] = useState({
    name: "",
    email: "",
    phone: "",
    sameAsDelivery: false,
  });

  const toggleSameAsDelivery = () => {
    const next = !ordererInfo.sameAsDelivery;
    setOrdererInfo((p) => ({
      ...p,
      sameAsDelivery: next,
      name: next ? deliveryInfo.recipient : p.name,
      phone: next ? deliveryInfo.phone : p.phone,
    }));
  };

  // ===== 쿠폰 / 적립금 =====
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [availableCoupons] = useState<Coupon[]>([
    {
      id: "coupon1",
      name: "신규 가입 10% 할인 쿠폰",
      discountRate: 10,
      discountAmount: 0,
      minOrderAmount: 30000,
      maxDiscountAmount: 10000,
      validUntil: "2025-08-19",
      description: "신규 회원 전용 할인 쿠폰입니다.",
    },
    {
      id: "coupon2",
      name: "여름 시즌 15% 할인 쿠폰",
      discountRate: 15,
      discountAmount: 0,
      minOrderAmount: 50000,
      maxDiscountAmount: 15000,
      validUntil: "2025-08-31",
      description: "여름 시즌 한정 특별 할인 쿠폰입니다.",
    },
    {
      id: "coupon3",
      name: "첫 구매 5,000원 할인 쿠폰",
      discountRate: 0,
      discountAmount: 5000,
      minOrderAmount: 20000,
      maxDiscountAmount: 5000,
      validUntil: "2025-12-31",
      description: "첫 구매 고객 전용 정액 할인 쿠폰입니다.",
    },
  ]);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [pointsUsed, setPointsUsed] = useState(0);
  const [availablePoints] = useState(5000);

  // ===== 금액 계산 =====
  const totalAmount = useMemo(
    () => orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [orderItems],
  );
  const shippingFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = Math.max(
    0,
    totalAmount + shippingFee - couponDiscount - pointsUsed,
  );

  // ===== 유틸 =====
  const handleDeliveryInfoChange = (
    field: keyof typeof deliveryInfo,
    value: string,
  ) => setDeliveryInfo((p) => ({ ...p, [field]: value }));

  const handleOrdererInfoChange = (
    field: keyof typeof ordererInfo,
    value: string | boolean,
  ) =>
    setOrdererInfo((p) => ({
      ...p,
      [field]: value,
    }));

  const applyCouponById = (id: string | "") => {
    setSelectedCoupon(id);
    if (!id) {
      setCouponDiscount(0);
      return;
    }
    const c = availableCoupons.find((x) => x.id === id);
    if (!c) return setCouponDiscount(0);

    if (totalAmount < c.minOrderAmount) {
      setCouponDiscount(0);
      return;
    }

    const raw =
      c.discountAmount > 0
        ? c.discountAmount
        : Math.floor((totalAmount * c.discountRate) / 100);

    setCouponDiscount(Math.min(raw, c.maxDiscountAmount));
  };

  const clampPoints = (val: number) => {
    const safe = Math.max(0, Math.min(val, availablePoints));
    setPointsUsed(safe);
  };

  // ===== 제출 가능 여부 =====
  const isEmailValid =
    !!ordererInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ordererInfo.email);

  const isFormValid =
    !!deliveryInfo.recipient &&
    !!deliveryInfo.phone &&
    !!deliveryInfo.address &&
    !!ordererInfo.name &&
    isEmailValid &&
    !!ordererInfo.phone;

  // ===== 결제(다음 단계) =====
  const handleProceedPayment = () => {
    if (!isFormValid) return;
    nav("/payment", {
      state: {
        orderItems,
        appliedCouponDiscount: couponDiscount,
        appliedPointsUsed: pointsUsed,
        shippingFee,
        totalPay: finalAmount,
      },
    });
  };

  // ====== input/select IDs (label 연결용) ======
  const ids = {
    dName: "d-name",
    dRecipient: "d-recipient",
    dPhone: "d-phone",
    dAddress: "d-address",
    dDetail: "d-detail",
    dRequest: "d-request",
    oName: "o-name",
    oEmail: "o-email",
    oPhone: "o-phone",
    couponSelect: "coupon-select",
    pointInput: "point-input",
    searchInput: "addr-search",
  } as const;

  return (
    <div className={styles.pageWrap}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.backBtn}
            aria-label="뒤로가기"
            onClick={() => window.history.back()}
          >
            <span className={styles.iconArrow} aria-hidden />
          </button>
          <h1 className={styles.headerTitle}>주문/결제</h1>
        </div>
      </header>

      <main className={styles.main}>
        {/* 주문 상품 (접기/펼치기) */}
        <section className={styles.card}>
          <button
            type="button"
            className={styles.cardTitleRow}
            onClick={() => setShowOrderItems((v) => !v)}
          >
            <h2 className={styles.cardTitle}>
              주문 상품 ({orderItems.length}개)
            </h2>
            <span
              className={`${styles.chev} ${
                showOrderItems ? styles.chevUp : styles.chevDown
              }`}
              aria-hidden
            />
          </button>

          {showOrderItems && (
            <div className={styles.itemsStack}>
              {orderItems.map((item, idx) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.thumbBox}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.thumb}
                    />
                  </div>
                  <div className={styles.itemMeta}>
                    <p className={styles.itemBrand}>{item.brand}</p>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemOpt}>
                      사이즈: {item.size} | 수량: {item.quantity}개
                    </p>
                    <p className={styles.itemPrice}>
                      {fmt(item.price * item.quantity)}원
                    </p>
                  </div>
                  {idx < orderItems.length - 1 && (
                    <div className={styles.rowDivider} />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 배송지 정보 */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>배송지 정보</h2>
          <div className={styles.formStack}>
            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.dName}>
                배송지명
              </label>
              <input
                id={ids.dName}
                className={styles.input}
                value={deliveryInfo.name}
                onChange={(e) =>
                  handleDeliveryInfoChange("name", e.target.value)
                }
                placeholder="예: 집, 회사"
              />
            </div>

            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.dRecipient}>
                수령인 <span className={styles.req}>*</span>
              </label>
              <input
                id={ids.dRecipient}
                className={styles.input}
                value={deliveryInfo.recipient}
                onChange={(e) =>
                  handleDeliveryInfoChange("recipient", e.target.value)
                }
                placeholder="받으실 분의 성함"
              />
            </div>

            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.dPhone}>
                연락처 <span className={styles.req}>*</span>
              </label>
              <input
                id={ids.dPhone}
                className={styles.input}
                value={deliveryInfo.phone}
                onChange={(e) =>
                  handleDeliveryInfoChange("phone", e.target.value)
                }
                placeholder="010-0000-0000"
              />
            </div>

            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.dAddress}>
                주소 <span className={styles.req}>*</span>
              </label>
              <div className={styles.row}>
                <input
                  id={ids.dAddress}
                  className={styles.input}
                  value={deliveryInfo.address}
                  onChange={(e) =>
                    handleDeliveryInfoChange("address", e.target.value)
                  }
                  placeholder="주소를 검색해주세요"
                />
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className={styles.btnGhost}
                >
                  주소검색
                </button>
              </div>

              {/* 주소 검색 모달 */}
              {isAddressModalOpen && (
                <div className={styles.modalBackdrop}>
                  <div className={styles.modalBox}>
                    <div className={styles.modalHeader}>
                      <h3 className={styles.modalTitle}>주소 검색</h3>
                      <button
                        type="button"
                        aria-label="닫기"
                        className={styles.iconBtn}
                        onClick={() => setIsAddressModalOpen(false)}
                      >
                        <span className={styles.iconClose} aria-hidden />
                      </button>
                    </div>

                    <div className={styles.searchRow}>
                      <label htmlFor={ids.searchInput} className="sr-only">
                        주소 검색어
                      </label>
                      <input
                        id={ids.searchInput}
                        className={styles.input}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="도로명/지번 주소를 입력하세요"
                      />
                      <button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={handleAddressSearch}
                      >
                        검색
                      </button>
                    </div>

                    <div className={styles.resultList}>
                      {isSearching ? (
                        <div className={styles.centerBox}>
                          <div className={styles.spinner} />
                        </div>
                      ) : hasSearched && searchResults.length === 0 ? (
                        <div className={styles.centerMuted}>
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        searchResults.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            className={styles.addrItem}
                            onClick={() => handleAddressSelect(r.address)}
                          >
                            <p className={styles.addrLine}>{r.address}</p>
                            <p className={styles.addrDetail}>{r.detail}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.dDetail}>
                상세주소
              </label>
              <input
                id={ids.dDetail}
                className={styles.input}
                value={deliveryInfo.detailAddress}
                onChange={(e) =>
                  handleDeliveryInfoChange("detailAddress", e.target.value)
                }
                placeholder="상세주소"
              />
            </div>

            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.dRequest}>
                배송 요청사항
              </label>
              <div className={styles.selectWrap}>
                <select
                  id={ids.dRequest}
                  className={styles.select}
                  value={deliveryInfo.deliveryRequest}
                  onChange={(e) =>
                    handleDeliveryInfoChange("deliveryRequest", e.target.value)
                  }
                >
                  <option value="직접 수령">직접 수령</option>
                  <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                  <option value="경비실에 맡겨주세요">
                    경비실에 맡겨주세요
                  </option>
                  <option value="택배함에 넣어주세요">
                    택배함에 넣어주세요
                  </option>
                  <option value="부재 시 연락 바랍니다">
                    부재 시 연락 바랍니다
                  </option>
                </select>
                <span className={styles.chevDownSmall} aria-hidden />
              </div>
            </div>
          </div>
        </section>

        {/* 주문자 정보 */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>주문자 정보</h2>

          <button
            type="button"
            className={styles.sameRow}
            onClick={toggleSameAsDelivery}
          >
            <span
              className={`${styles.checkSquare} ${
                ordererInfo.sameAsDelivery ? styles.checkOn : ""
              }`}
              aria-hidden
            />
            <span className={styles.sameLabel}>배송지 정보와 동일</span>
          </button>

          <div className={styles.formStack}>
            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.oName}>
                이름 <span className={styles.req}>*</span>
              </label>
              <input
                id={ids.oName}
                className={styles.input}
                value={ordererInfo.name}
                onChange={(e) =>
                  handleOrdererInfoChange("name", e.target.value)
                }
                placeholder="주문자 성함"
              />
            </div>

            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.oEmail}>
                이메일 <span className={styles.req}>*</span>
              </label>
              <input
                id={ids.oEmail}
                className={styles.input}
                value={ordererInfo.email}
                onChange={(e) =>
                  handleOrdererInfoChange("email", e.target.value)
                }
                placeholder="example@email.com"
              />
            </div>

            <div className={styles.formItem}>
              <label className={styles.label} htmlFor={ids.oPhone}>
                연락처 <span className={styles.req}>*</span>
              </label>
              <input
                id={ids.oPhone}
                className={styles.input}
                value={ordererInfo.phone}
                onChange={(e) =>
                  handleOrdererInfoChange("phone", e.target.value)
                }
                placeholder="010-0000-0000"
              />
            </div>
          </div>
        </section>

        {/* 할인 적용 */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>할인 적용</h2>

          {/* 쿠폰 */}
          <div className={styles.formItem}>
            <label className={styles.label} htmlFor={ids.couponSelect}>
              쿠폰
            </label>
            <div className={styles.row}>
              <div className={styles.selectWrap}>
                <select
                  id={ids.couponSelect}
                  className={styles.select}
                  value={selectedCoupon}
                  onChange={(e) => applyCouponById(e.target.value)}
                >
                  <option value="">사용 가능한 쿠폰 선택</option>
                  {availableCoupons.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className={styles.chevDownSmall} aria-hidden />
              </div>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => setIsCouponModalOpen(true)}
              >
                쿠폰 조회
              </button>
            </div>

            {/* 쿠폰 모달 */}
            {isCouponModalOpen && (
              <div className={styles.modalBackdrop}>
                <div className={styles.modalBox}>
                  <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>보유 쿠폰 목록</h3>
                    <button
                      type="button"
                      aria-label="닫기"
                      className={styles.iconBtn}
                      onClick={() => setIsCouponModalOpen(false)}
                    >
                      <span className={styles.iconClose} aria-hidden />
                    </button>
                  </div>

                  <div className={styles.couponList}>
                    {availableCoupons.map((coupon) => {
                      const isSelected = selectedCoupon === coupon.id;
                      return (
                        <button
                          key={coupon.id}
                          type="button"
                          className={`${styles.couponItem} ${
                            isSelected ? styles.couponOn : ""
                          }`}
                          onClick={() => applyCouponById(coupon.id)}
                        >
                          <div className={styles.couponHead}>
                            <h4 className={styles.couponName}>{coupon.name}</h4>
                            <div className={styles.couponBadge}>
                              {coupon.discountRate
                                ? `${coupon.discountRate}%`
                                : `${fmt(coupon.discountAmount)}원`}
                            </div>
                          </div>
                          <p className={styles.couponDesc}>
                            {coupon.description}
                          </p>
                          <div className={styles.couponMeta}>
                            <p>최소 주문금액: {fmt(coupon.minOrderAmount)}원</p>
                            <p>
                              최대 할인금액: {fmt(coupon.maxDiscountAmount)}원
                            </p>
                            <p>유효기간: ~ {coupon.validUntil}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.btnGhost}
                      onClick={() => setIsCouponModalOpen(false)}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className={styles.btnPrimary}
                      onClick={() => setIsCouponModalOpen(false)}
                    >
                      적용
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 적립금 */}
          <div className={styles.formItem}>
            <label className={styles.label} htmlFor={ids.pointInput}>
              적립금
            </label>
            <div className={styles.row}>
              <input
                id={ids.pointInput}
                className={styles.input}
                inputMode="numeric"
                value={pointsUsed || ""}
                onChange={(e) => {
                  const n = Number(e.target.value || 0);
                  clampPoints(n < MIN_POINT_USE && n !== 0 ? 0 : n);
                }}
                placeholder="사용할 적립금 입력"
              />
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => clampPoints(availablePoints)}
                title={
                  availablePoints < MIN_POINT_USE
                    ? `${fmt(MIN_POINT_USE)}원 이상부터 사용 가능`
                    : ""
                }
              >
                전액 사용
              </button>
            </div>
            <p className={styles.helper}>
              보유 적립금: {fmt(availablePoints)}원
            </p>
          </div>
        </section>

        {/* 결제 정보 요약 */}
        <section className={styles.summaryCard}>
          <h3 className={styles.cardTitle}>결제 정보</h3>
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span className={styles.muted}>상품 금액</span>
              <span className={styles.bold}>{fmt(totalAmount)}원</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.muted}>쿠폰 할인</span>
              <span className={styles.minus}>- {fmt(couponDiscount)}원</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.muted}>적립금 사용</span>
              <span className={styles.minus}>- {fmt(pointsUsed)}원</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.muted}>배송비</span>
              <span className={styles.bold}>
                {shippingFee === 0 ? (
                  <span className={styles.free}>무료</span>
                ) : (
                  `${fmt(shippingFee)}원`
                )}
              </span>
            </div>
            <div className={styles.summaryTotal}>
              <span>총 결제 금액</span>
              <b>{fmt(finalAmount)}원</b>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 고정 결제 버튼 */}
      <div className={styles.fixedBar}>
        <div className={styles.fixedInner}>
          <div className={styles.fixedRight}>
            <p className={styles.fixedMeta}>총 {orderItems.length}개 상품</p>
            <p className={styles.fixedPrice}>{fmt(finalAmount)}원</p>
          </div>
          <button
            type="button"
            disabled={!isFormValid}
            onClick={handleProceedPayment}
            className={`${styles.payButton} ${
              isFormValid ? "" : styles.payDisabled
            }`}
          >
            {fmt(finalAmount)}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
