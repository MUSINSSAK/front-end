import type React from "react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { OrderItem, PaymentState } from "../../types/order";
import styles from "./Payment.module.css";

// 숫자 포맷터
const fmt = (n: number) =>
  n.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

// ===== 키 =====
const ORDER_STATE_SS = "musinssak_order_state"; // Order에서 백업한 결제 상태
const CART_SS = "musinssak_cart_selected"; // Cart 저장본(선택항목 포함)

// ===== 타입 가드 =====
function isPaymentStateLike(v: any): v is PaymentState {
  return (
    v &&
    typeof v === "object" &&
    Array.isArray(v.orderItems) &&
    typeof v.appliedCouponDiscount === "number" &&
    typeof v.appliedPointsUsed === "number" &&
    typeof v.shippingFee === "number" &&
    typeof v.totalPay === "number"
  );
}

// Cart(OrderItemData[]) 또는 OrderItem[] → OrderItem[]
function mapCartDataToOrderItems(arr: any[]): OrderItem[] {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  if ("option" in (arr[0] as any)) {
    // Cart 포맷
    return arr
      .filter((i: any) => i.selected)
      .map((i: any) => ({
        id: i.id,
        brand: i.brand,
        name: i.name,
        size: i.option,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      }));
  }
  return arr as OrderItem[];
}

// ===== Cart 저장값으로부터 "원가 합계"와 "장바구니 할인 합계" 복원 =====
// - productAmount(할인가 합계)는 orderItems에서 계산
// - originalTotal과 cartDiscount는 CART_SS에서 originalPrice를 읽어 계산
function restoreOriginalAndDiscount(orderItems: OrderItem[]): {
  originalTotal: number; // 할인 전 상품금액
  cartDiscount: number; // 장바구니 할인(= 원가-판매가)
} {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(CART_SS);
  } catch {}
  if (!raw) {
    try {
      raw = localStorage.getItem(CART_SS);
    } catch {}
  }
  if (!raw) return { originalTotal: 0, cartDiscount: 0 };

  try {
    const arr = JSON.parse(raw) as any[];
    if (!Array.isArray(arr) || arr.length === 0)
      return { originalTotal: 0, cartDiscount: 0 };

    // 선택된 항목만 id → 데이터 매핑
    const byId = new Map<number, any>();
    arr.filter((x) => x.selected).forEach((x) => byId.set(x.id, x));

    let originalTotal = 0;
    let discount = 0;

    for (const oi of orderItems) {
      const src = byId.get(oi.id);
      if (!src) continue;
      const qty = oi.quantity ?? 1;
      const orig = (src.originalPrice ?? oi.price) * qty; // originalPrice 불가시 fallback
      const sale = (src.price ?? oi.price) * qty;
      originalTotal += orig;
      discount += Math.max(0, orig - sale);
    }
    return { originalTotal, cartDiscount: discount };
  } catch {
    return { originalTotal: 0, cartDiscount: 0 };
  }
}

// ===== Payment state 복구 =====
function restorePaymentState(locationState: unknown): PaymentState | undefined {
  // 1) 라우터 state
  if (isPaymentStateLike(locationState)) return locationState as PaymentState;

  // 2) 세션 저장본(주문서에서 백업)
  try {
    const raw = sessionStorage.getItem(ORDER_STATE_SS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isPaymentStateLike(parsed)) return parsed as PaymentState;
    }
  } catch {}

  // 3) Cart 저장본으로 최소 구성
  try {
    const raw =
      sessionStorage.getItem(CART_SS) || localStorage.getItem(CART_SS);
    if (raw) {
      const arr = JSON.parse(raw);
      const orderItems = mapCartDataToOrderItems(arr);
      if (orderItems.length) {
        const productAmount = orderItems.reduce(
          (s, it) => s + it.price * it.quantity,
          0,
        );
        const shippingFee = productAmount >= 50000 ? 0 : 3000;
        return {
          orderItems,
          appliedCouponDiscount: 0,
          appliedPointsUsed: 0,
          shippingFee,
          totalPay: productAmount + shippingFee,
        };
      }
    }
  } catch {}

  // 4) 최종 폴백(데모)
  const demoItems: OrderItem[] = [
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
  ];
  const productAmount = demoItems.reduce(
    (s, it) => s + it.price * it.quantity,
    0,
  );
  const shippingFee = productAmount >= 50000 ? 0 : 3000;

  return {
    orderItems: demoItems,
    appliedCouponDiscount: 0,
    appliedPointsUsed: 0,
    shippingFee,
    totalPay: productAmount + shippingFee,
  };
}

type PaymentMethod = "card" | "simple" | "transfer";
type SimplePay = "" | "kakao" | "naver";

const Payment: React.FC = () => {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: Partial<PaymentState> };

  const restored = restorePaymentState(state);
  const hasState = !!restored;

  const s = restored as PaymentState;

  const orderItems: OrderItem[] = s.orderItems ?? [];
  const appliedCouponDiscount = s.appliedCouponDiscount ?? 0;
  const appliedPointsUsed = s.appliedPointsUsed ?? 0;
  const shippingFee = s.shippingFee ?? 0;
  const totalPayFromOrder = s.totalPay ?? 0;

  // 판매가 합계(= Order/Cart에서 세일가 합계)
  const productAmount = useMemo(
    () => orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [orderItems],
  );

  // 저장된 Cart 기준 "원가 합계"와 "장바구니 할인" 복원 (표시용)
  const { originalTotal, cartDiscount } = useMemo(
    () => restoreOriginalAndDiscount(orderItems),
    [orderItems],
  );

  // ===== 결제 수단/폼 및 동의 =====
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("card");

  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvc: "",
    password: "",
  });
  const handleCardInfoChange = (field: keyof typeof cardInfo, value: string) =>
    setCardInfo((p) => ({ ...p, [field]: value }));

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/\D/g, "").slice(0, 16);
    return v.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/\D/g, "").slice(0, 4);
    if (v.length <= 2) return v;
    return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
  };

  const [simplePaymentService, setSimplePaymentService] =
    useState<SimplePay>("");
  const [bankTransferInfo, setBankTransferInfo] = useState({
    bank: "",
    depositorName: "",
  });

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    payment: false,
    thirdParty: false,
  });
  const toggleAgree = (k: keyof typeof agreements) =>
    setAgreements((p) => ({ ...p, [k]: !p[k] }));
  const allAgreed = Object.values(agreements).every(Boolean);

  const validCard =
    cardInfo.number.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(cardInfo.expiry) &&
    /^\d{3}$/.test(cardInfo.cvc) &&
    /^\d{2}$/.test(cardInfo.password);
  const validSimple = simplePaymentService !== "";
  const validTransfer =
    bankTransferInfo.bank !== "" &&
    bankTransferInfo.depositorName.trim().length > 0;

  const isFormValid = () => {
    if (!allAgreed) return false;
    if (!hasState || orderItems.length === 0) return false;
    if (selectedPaymentMethod === "card") return validCard;
    if (selectedPaymentMethod === "simple") return validSimple;
    if (selectedPaymentMethod === "transfer") return validTransfer;
    return false;
  };

  // ====== 결제 처리 (데모) ======
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePayment = async () => {
    if (!isFormValid()) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsProcessing(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      nav("/mypage/orders");
    }, 1200);
  };

  if (!hasState) {
    return (
      <div className={styles.emptyWrap}>
        <div className={styles.emptyBox}>
          <h1 className={styles.emptyTitle}>주문 정보가 없습니다</h1>
          <p className={styles.emptySub}>
            주문 페이지에서 상품과 할인 내역을 선택한 뒤 다시 진행해주세요.
          </p>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => nav("/order")}
          >
            주문 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  const ids = {
    cardNumber: "card-number",
    cardExpiry: "card-expiry",
    cardCvc: "card-cvc",
    cardPw: "card-pw",
    bankSelect: "bank-select",
    depositor: "bank-depositor",
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
          <h1 className={styles.headerTitle}>결제하기</h1>
        </div>
      </header>

      <main className={styles.main}>
        {/* ① 주문 상품 확인 (Order와 동일한 레이아웃) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>주문 상품 확인</h2>

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
                </div>
                <div className={styles.itemPrice}>
                  {fmt(item.price * item.quantity)}원
                </div>
                {idx < orderItems.length - 1 && (
                  <div className={styles.rowDivider} />
                )}
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          {/* ② 결제 정보 — Order 페이지와 같은 순서/표현 */}
          <div className={styles.totalWrap}>
            <div className={styles.priceRow}>
              <span className={styles.muted}>상품 금액</span>
              <span>{fmt(originalTotal || productAmount)}원</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.muted}>장바구니 할인</span>
              <span className={styles.minus}>- {fmt(cartDiscount)}원</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.muted}>쿠폰 할인</span>
              <span className={styles.minus}>
                - {fmt(appliedCouponDiscount)}원
              </span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.muted}>적립금 사용</span>
              <span className={styles.minus}>- {fmt(appliedPointsUsed)}원</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.muted}>배송비</span>
              <span>
                {shippingFee === 0 ? (
                  <span className={styles.free}>무료</span>
                ) : (
                  `${fmt(shippingFee)}원`
                )}
              </span>
            </div>

            <div className={styles.totalBar}>
              <span className={styles.totalLabel}>총 결제 금액</span>
              <span className={styles.totalPay}>
                {fmt(totalPayFromOrder)}원
              </span>
            </div>
          </div>
        </section>

        {/* ③ 결제 동의 사항 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>결제 동의 사항</h3>
          {[
            {
              key: "terms",
              label: "구매조건 확인 및 결제진행에 동의",
              sub: "상품의 교환/반품/환불 조건을 확인하였으며, 구매에 동의합니다.",
            },
            {
              key: "privacy",
              label: "개인정보 수집·이용 동의",
              sub: "결제 및 배송을 위한 개인정보 수집·이용에 동의합니다.",
            },
            {
              key: "payment",
              label: "결제대행 서비스 약관 동의",
              sub: "안전한 결제를 위한 결제대행 서비스 이용약관에 동의합니다.",
            },
            {
              key: "thirdParty",
              label: "개인정보 제3자 제공 동의",
              sub: "배송업체 등 서비스 제공을 위한 개인정보 제3자 제공에 동의합니다.",
            },
          ].map(({ key, label, sub }) => (
            <div key={key} className={styles.agreeItem}>
              <button
                type="button"
                className={styles.checkBox}
                onClick={() => toggleAgree(key as keyof typeof agreements)}
              >
                <span
                  className={`${styles.checkSquare} ${
                    agreements[key as keyof typeof agreements]
                      ? styles.checkOn
                      : ""
                  }`}
                  aria-hidden
                />
              </button>
              <div className={styles.agreeTexts}>
                <span className={styles.agreeTitle}>
                  {label} <span className={styles.req}>(필수)</span>
                </span>
                <p className={styles.agreeSub}>{sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ④ 결제 수단 선택 & 입력 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>결제 수단 선택</h2>

          <div className={styles.tileGrid}>
            {/* 카드 */}
            <button
              type="button"
              className={`${styles.tile} ${
                selectedPaymentMethod === "card" ? styles.tileSelected : ""
              }`}
              onClick={() => setSelectedPaymentMethod("card")}
            >
              <div className={styles.tileHead}>
                <div className={styles.tileLeft}>
                  <span
                    className={`${styles.iconBadge} ${styles.iconCard}`}
                    aria-hidden
                  />
                  <span className={styles.tileLabel}>신용/체크카드</span>
                </div>
                <span
                  className={`${styles.radioDot} ${
                    selectedPaymentMethod === "card" ? styles.radioDotOn : ""
                  }`}
                  aria-hidden
                />
              </div>
              <p className={styles.tileDesc}>안전하고 빠른 카드 결제</p>
            </button>

            {/* 간편결제 */}
            <button
              type="button"
              className={`${styles.tile} ${
                selectedPaymentMethod === "simple" ? styles.tileSelected : ""
              }`}
              onClick={() => setSelectedPaymentMethod("simple")}
            >
              <div className={styles.tileHead}>
                <div className={styles.tileLeft}>
                  <span
                    className={`${styles.iconBadge} ${styles.iconPhone}`}
                    aria-hidden
                  />
                  <span className={styles.tileLabel}>간편결제</span>
                </div>
                <span
                  className={`${styles.radioDot} ${
                    selectedPaymentMethod === "simple" ? styles.radioDotOn : ""
                  }`}
                  aria-hidden
                />
              </div>
              <p className={styles.tileDesc}>카카오페이, 네이버페이 등</p>
            </button>

            {/* 무통장입금 */}
            <button
              type="button"
              className={`${styles.tile} ${
                selectedPaymentMethod === "transfer" ? styles.tileSelected : ""
              }`}
              onClick={() => setSelectedPaymentMethod("transfer")}
            >
              <div className={styles.tileHead}>
                <div className={styles.tileLeft}>
                  <span
                    className={`${styles.iconBadge} ${styles.iconBank}`}
                    aria-hidden
                  />
                  <span className={styles.tileLabel}>무통장입금</span>
                </div>
                <span
                  className={`${styles.radioDot} ${
                    selectedPaymentMethod === "transfer"
                      ? styles.radioDotOn
                      : ""
                  }`}
                  aria-hidden
                />
              </div>
              <p className={styles.tileDesc}>계좌이체로 결제</p>
            </button>
          </div>

          {/* 입력 폼 */}
          <div className={styles.formStack} style={{ marginTop: 12 }}>
            {selectedPaymentMethod === "card" && (
              <>
                <div className={styles.formItem}>
                  <label className={styles.label} htmlFor={ids.cardNumber}>
                    카드번호 <span className={styles.req}>*</span>
                  </label>
                  <input
                    id={ids.cardNumber}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardInfo.number}
                    onChange={(e) =>
                      handleCardInfoChange(
                        "number",
                        formatCardNumber(e.target.value),
                      )
                    }
                    className={styles.input}
                  />
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.formItem}>
                    <label className={styles.label} htmlFor={ids.cardExpiry}>
                      유효기간 <span className={styles.req}>*</span>
                    </label>
                    <input
                      id={ids.cardExpiry}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardInfo.expiry}
                      onChange={(e) =>
                        handleCardInfoChange(
                          "expiry",
                          formatExpiry(e.target.value),
                        )
                      }
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formItem}>
                    <label className={styles.label} htmlFor={ids.cardCvc}>
                      CVC <span className={styles.req}>*</span>
                    </label>
                    <input
                      id={ids.cardCvc}
                      inputMode="numeric"
                      placeholder="000"
                      maxLength={3}
                      value={cardInfo.cvc}
                      onChange={(e) =>
                        handleCardInfoChange(
                          "cvc",
                          e.target.value.replace(/\D/g, "").slice(0, 3),
                        )
                      }
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formItem}>
                  <label className={styles.label} htmlFor={ids.cardPw}>
                    카드 비밀번호 앞 2자리 <span className={styles.req}>*</span>
                  </label>
                  <input
                    id={ids.cardPw}
                    type="password"
                    inputMode="numeric"
                    placeholder="••"
                    maxLength={2}
                    value={cardInfo.password}
                    onChange={(e) =>
                      handleCardInfoChange(
                        "password",
                        e.target.value.replace(/\D/g, "").slice(0, 2),
                      )
                    }
                    className={styles.input}
                  />
                </div>
              </>
            )}

            {selectedPaymentMethod === "simple" && (
              <div className={styles.formItem}>
                <p className={styles.label}>
                  간편결제 서비스 선택 <span className={styles.req}>*</span>
                </p>
                <div className={styles.simpleGrid}>
                  <button
                    type="button"
                    className={`${styles.simpleBtn} ${
                      simplePaymentService === "kakao" ? styles.simpleBtnOn : ""
                    }`}
                    onClick={() => setSimplePaymentService("kakao")}
                  >
                    <span className={styles.kakaoDot} aria-hidden />
                    <span>카카오페이</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.simpleBtn} ${
                      simplePaymentService === "naver" ? styles.simpleBtnOn : ""
                    }`}
                    onClick={() => setSimplePaymentService("naver")}
                  >
                    <span className={styles.naverDot} aria-hidden />
                    <span>네이버페이</span>
                  </button>
                </div>
              </div>
            )}

            {selectedPaymentMethod === "transfer" && (
              <>
                <div className={styles.formItem}>
                  <label className={styles.label} htmlFor={ids.bankSelect}>
                    입금 은행 선택 <span className={styles.req}>*</span>
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id={ids.bankSelect}
                      value={bankTransferInfo.bank}
                      onChange={(e) =>
                        setBankTransferInfo((p) => ({
                          ...p,
                          bank: e.target.value,
                        }))
                      }
                      className={styles.select}
                    >
                      <option value="">은행을 선택해주세요</option>
                      <option value="kb">KB국민은행</option>
                      <option value="shinhan">신한은행</option>
                      <option value="woori">우리은행</option>
                      <option value="hana">하나은행</option>
                      <option value="nh">NH농협은행</option>
                      <option value="ibk">IBK기업은행</option>
                    </select>
                    <span className={styles.chevDown} aria-hidden />
                  </div>
                </div>

                <div className={styles.formItem}>
                  <label className={styles.label} htmlFor={ids.depositor}>
                    입금자명 <span className={styles.req}>*</span>
                  </label>
                  <input
                    id={ids.depositor}
                    placeholder="입금하실 분의 성함을 입력해주세요"
                    value={bankTransferInfo.depositorName}
                    onChange={(e) =>
                      setBankTransferInfo((p) => ({
                        ...p,
                        depositorName: e.target.value,
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* 고정 하단 결제 버튼 */}
      <div className={styles.fixedBar}>
        <div className={styles.fixedInner}>
          <div className={styles.fixedRight}>
            <p className={styles.fixedMeta}>총 {orderItems.length}개 상품</p>
            <p className={styles.fixedPrice}>{fmt(totalPayFromOrder)}원</p>
          </div>
          <button
            type="button"
            onClick={handlePayment}
            disabled={!isFormValid() || isProcessing}
            className={`${styles.payButton} ${
              isFormValid() && !isProcessing ? "" : styles.payButtonDisabled
            }`}
          >
            {isProcessing
              ? "결제 처리 중..."
              : `${fmt(totalPayFromOrder)}원 결제하기`}
          </button>
        </div>
      </div>

      {/* 결제 성공 모달 */}
      {showSuccessModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalIconWrap}>
              <span className={styles.modalIcon} aria-hidden />
            </div>
            <h3 className={styles.modalTitle}>결제가 완료되었습니다!</h3>
            <p className={styles.modalSub}>주문 확인 페이지로 이동합니다.</p>
            <div className={styles.spinnerSmall} aria-hidden />
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
