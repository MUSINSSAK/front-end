import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { completePayment, requestPayment } from "../../api/payments";
import type { OrderItem, PaymentState } from "../../types/order";
import styles from "./Payment.module.css";

// 포트원 V2 SDK 타입 선언
declare global {
  interface Window {
    PortOne: {
      requestPayment: (
        params: PortOnePaymentParams,
      ) => Promise<PortOnePaymentResponse>;
    };
  }
}

type PortOnePaymentParams = {
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: string;
  payMethod: string;
  customer?: {
    fullName: string;
    email: string;
  };
};

type PortOnePaymentResponse = {
  paymentId: string;
  transactionType: string;
  txId?: string;
  code?: string;
  message?: string;
};

const ORDER_STATE_SS = "musinssak_order_state";
const CART_SS = "musinssak_cart_selected";

const formatCurrency = (value: number) =>
  `${Math.max(0, value).toLocaleString("ko-KR", { maximumFractionDigits: 0 })}원`;

type PaymentMethod = "card" | "simple" | "transfer";
type AgreementKey = "terms" | "privacy" | "withdrawal";
type SimpleService = "kakao" | "naver";

const AGREEMENTS: Array<{
  key: AgreementKey;
  label: string;
  description: string;
}> = [
  {
    key: "terms",
    label: "구매조건 확인 및 결제 진행에 동의",
    description: "상품의 교환·반품·환불 조건을 확인했습니다.",
  },
  {
    key: "privacy",
    label: "배송 및 결제 처리를 위한 개인정보 수집·이용에 동의",
    description: "배송지, 연락처 등 결제 이행에 필요한 정보를 제공합니다.",
  },
  {
    key: "withdrawal",
    label: "청약 철회 제한에 동의",
    description: "전자상거래법상 환불이 제한되는 경우에 동의합니다.",
  },
];

const CARD_COMPANIES = [
  "국민카드",
  "신한카드",
  "우리카드",
  "하나카드",
  "롯데카드",
  "현대카드",
  "비씨카드",
  "삼성카드",
];

const INSTALLMENT_OPTIONS = ["일시불", "2개월", "3개월", "6개월", "12개월"];

const BANK_OPTIONS = [
  { value: "kb", label: "KB국민은행" },
  { value: "shinhan", label: "신한은행" },
  { value: "woori", label: "우리은행" },
  { value: "hana", label: "하나은행" },
  { value: "nh", label: "NH농협은행" },
  { value: "ibk", label: "IBK기업은행" },
];

function isPaymentState(value: unknown): value is PaymentState {
  return (
    !!value &&
    typeof value === "object" &&
    Array.isArray((value as PaymentState).orderItems) &&
    typeof (value as PaymentState).appliedCouponDiscount === "number" &&
    typeof (value as PaymentState).appliedPointsUsed === "number" &&
    typeof (value as PaymentState).shippingFee === "number" &&
    typeof (value as PaymentState).totalPay === "number"
  );
}

function mapCartDataToOrderItems(raw: unknown): OrderItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if ("option" in (raw[0] as Record<string, unknown>)) {
    return (raw as Array<Record<string, unknown>>)
      .filter((item) => item.selected)
      .map((item) => ({
        id: item.id,
        brand: item.brand,
        name: item.name,
        size: item.option,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
  }
  return raw as OrderItem[];
}

const FALLBACK_ITEMS: OrderItem[] = [
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
    size: "255",
    price: 109000,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=white%20leather%20sneakers%20on%20clean%20white%20background%20minimalist%20product%20photography%20studio%20lighting%20professional%20commercial%20style&width=80&height=80&seq=order2&orientation=squarish",
  },
];

const FALLBACK_STATE: PaymentState = {
  orderItems: FALLBACK_ITEMS,
  appliedCouponDiscount: 0,
  appliedPointsUsed: 0,
  shippingFee: 3000,
  totalPay:
    FALLBACK_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0) +
    3000,
};

function restorePaymentState(locationState: unknown): PaymentState {
  if (isPaymentState(locationState)) return locationState;

  try {
    const raw = sessionStorage.getItem(ORDER_STATE_SS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isPaymentState(parsed)) return parsed;
    }
  } catch {}

  try {
    const raw =
      sessionStorage.getItem(CART_SS) || localStorage.getItem(CART_SS);
    if (raw) {
      const parsed = JSON.parse(raw);
      const orderItems = mapCartDataToOrderItems(parsed);
      if (orderItems.length) {
        const productTotal = orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const shippingFee =
          productTotal >= 50000 ? 0 : productTotal > 0 ? 3000 : 0;
        return {
          orderItems,
          appliedCouponDiscount: 0,
          appliedPointsUsed: 0,
          shippingFee,
          totalPay: productTotal + shippingFee,
        };
      }
    }
  } catch {}

  return FALLBACK_STATE;
}

function restoreOriginalAndCartDiscount(orderItems: OrderItem[]): {
  originalTotal: number;
  cartDiscount: number;
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
    const arr = JSON.parse(raw) as Array<Record<string, unknown>>;
    if (!Array.isArray(arr) || arr.length === 0)
      return { originalTotal: 0, cartDiscount: 0 };

    const hasOriginalPrice = "originalPrice" in (arr[0] ?? {});
    const selectedMap = new Map<number, Record<string, any>>();
    arr
      .filter((item) => item.selected)
      .forEach((item) => selectedMap.set(item.id, item));

    let originalTotal = 0;
    let discount = 0;

    for (const item of orderItems) {
      const source = selectedMap.get(item.id);
      if (!source) continue;
      const quantity = item.quantity ?? 1;
      if (hasOriginalPrice) {
        const base = Number(source.originalPrice) * quantity;
        const sale = Number(source.price ?? item.price) * quantity;
        originalTotal += base;
        discount += Math.max(0, base - sale);
      } else {
        const sale = item.price * quantity;
        originalTotal += sale;
      }
    }
    return { originalTotal, cartDiscount: discount };
  } catch {
    return { originalTotal: 0, cartDiscount: 0 };
  }
}

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: PaymentState };

  const [paymentState] = useState(() => restorePaymentState(state));
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardInfo, setCardInfo] = useState({
    company: "",
    number: "",
    expiry: "",
    cvc: "",
    installment: INSTALLMENT_OPTIONS[0],
  });
  const [simpleService, setSimpleService] = useState<SimpleService | "">("");
  const [bankInfo, setBankInfo] = useState({ bank: "", depositorName: "" });
  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>({
    terms: false,
    privacy: false,
    withdrawal: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { originalTotal, cartDiscount } = useMemo(
    () => restoreOriginalAndCartDiscount(paymentState.orderItems),
    [paymentState.orderItems],
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(ORDER_STATE_SS, JSON.stringify(paymentState));
    } catch {}
  }, [paymentState]);

  const resetDependentFields = (nextMethod: PaymentMethod) => {
    if (nextMethod !== "card") {
      setCardInfo((prev) => ({ ...prev, number: "", expiry: "", cvc: "" }));
    }
    if (nextMethod !== "simple") setSimpleService("");
    if (nextMethod !== "transfer") setBankInfo({ bank: "", depositorName: "" });
  };

  const handleMethodChange = (nextMethod: PaymentMethod) => {
    setMethod(nextMethod);
    resetDependentFields(nextMethod);
  };

  const allAgreementsChecked = AGREEMENTS.every(({ key }) => agreements[key]);

  const toggleAgreement = (key: AgreementKey) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({ terms: checked, privacy: checked, withdrawal: checked });
  };

  const sanitizedCardNumber = cardInfo.number.replace(/[^0-9]/g, "");
  const sanitizedCardExpiry = cardInfo.expiry.replace(/[^0-9]/g, "");
  const sanitizedCardCvc = cardInfo.cvc.replace(/[^0-9]/g, "");

  const isCardValid =
    method !== "card" ||
    (cardInfo.company !== "" &&
      sanitizedCardNumber.length === 16 &&
      sanitizedCardExpiry.length === 4 &&
      sanitizedCardCvc.length === 3);

  const isSimpleValid = method !== "simple" || simpleService !== "";
  const isTransferValid =
    method !== "transfer" ||
    (bankInfo.bank !== "" && bankInfo.depositorName.trim().length >= 2);

  const isFormValid =
    paymentState.orderItems.length > 0 &&
    allAgreementsChecked &&
    isCardValid &&
    isSimpleValid &&
    isTransferValid &&
    !isProcessing;

  const handlePayment = async () => {
    if (!isFormValid) return;
    setIsProcessing(true);

    try {
      // 간편결제가 선택된 경우에만 포트원 결제 실행
      if (method === "simple") {
        await handlePortonePayment();
      } else {
        // 기존 결제 로직 (카드, 계좌이체)
        setShowSuccessModal(true);
        setTimeout(() => {
          setIsProcessing(false);
          setShowSuccessModal(false);
          navigate("/order", { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsProcessing(false);
    }
  };

  const handlePortonePayment = async () => {
    try {
      // orderId를 sessionStorage나 state에서 가져오기
      const orderId = getOrderIdFromSession();
      if (!orderId) {
        alert("주문 정보를 찾을 수 없습니다. 주문을 다시 진행해주세요.");
        return;
      }

      // 1. 백엔드에 결제 요청
      const paymentData = await requestPayment(orderId);

      // 디버깅용 로그 추가
      console.log("백엔드 응답 데이터:", paymentData);
      console.log("merchantId:", paymentData.merchantId); // "TC0ONETIME" 확인

      // 2. 포트원 V2 결제창 호출
      console.log("포트원 V2 SDK 체크:", !!window.PortOne);

      if (!window.PortOne) {
        throw new Error("포트원 V2 SDK가 로드되지 않았습니다.");
      }

      // 결제 파라미터 로그
      const paymentParams = {
        storeId: paymentData.merchantId,
        channelKey: paymentData.channelKey,
        paymentId: paymentData.paymentId,
        orderName: paymentData.orderName,
        totalAmount: paymentData.totalAmount,
        currency: paymentData.currency,
        payMethod: "EASY_PAY", // 간편결제
        customer: {
          fullName: paymentData.customerName,
          email: paymentData.customerEmail,
        },
      };

      console.log("포트원 V2 결제 파라미터:", paymentParams);

      const response = await window.PortOne.requestPayment(paymentParams);

      console.log("포트원 V2 결제 응답:", response);
      console.log("응답 타입:", typeof response);
      console.log("응답 코드:", response?.code);
      console.log("응답 메시지:", response?.message);

      // V2 API는 txId가 있으면 결제 성공
      if (response.txId && response.transactionType === "PAYMENT") {
        // 포트원 결제 성공 - 백엔드에 결제 완료 알림
        console.log("✅ 포트원 V2 결제 성공:", response);
        await handlePaymentComplete(response, paymentData.paymentId, orderId);
      } else {
        // 결제 실패 또는 취소
        console.error("❌ 포트원 V2 결제 실패:", response);
        const errorMessage = response.message || "결제에 실패했습니다.";
        alert(`결제 실패: ${errorMessage}`);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("포트원 결제 요청 실패:", error);
      alert("결제 요청에 실패했습니다. 다시 시도해주세요.");
      setIsProcessing(false);
    }
  };

  // 포트원 결제 성공 후 백엔드에 결제 완료 알림
  const handlePaymentComplete = async (
    paymentResponse: PortOnePaymentResponse,
    paymentId: string,
    orderId: string,
  ) => {
    try {
      console.log("포트원 응답 상세:", paymentResponse);
      console.log("백엔드 호출 URL:", `/api/payments/${paymentId}/complete`);
      console.log("전송 데이터:", {
        transactionId: paymentResponse.txId,
        status: "PAID",
      });

      // 백엔드에 결제 완료 알림
      const result = await completePayment(paymentId, {
        transactionId: paymentResponse.txId!,
        status: "PAID",
      });

      // 성공 시 결제 성공 페이지로 이동
      console.log("✅ 결제 완료 처리 성공! 주문 완료 페이지로 이동");
      alert("결제가 완료되었습니다!");

      navigate("/payment/success", {
        state: {
          paymentId: paymentId,
          txId: paymentResponse.txId,
          orderId: orderId,
          orderNumber: result.orderNumber,
          finalAmount: result.finalAmount,
        },
      });
    } catch (error: unknown) {
      console.error("백엔드 API 호출 오류:", error);

      // 결제는 성공했지만 백엔드 처리 실패
      alert(
        "결제는 완료되었으나 주문 처리 중 오류가 발생했습니다.\n고객센터에 문의해주세요.",
      );

      // 그래도 성공 페이지로 이동 (결제는 완료됨)
      navigate("/payment/success", {
        state: {
          paymentId: paymentId,
          txId: paymentResponse.txId,
          orderId: orderId,
          error: "백엔드 처리 실패",
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // sessionStorage에서 orderId 가져오기
  const getOrderIdFromSession = (): string | null => {
    try {
      // 최근 주문 정보에서 orderId 가져오기
      const recentOrder = sessionStorage.getItem("musinssak_recent_order");
      if (recentOrder) {
        const parsed = JSON.parse(recentOrder);
        return parsed.orderId || null;
      }
    } catch (error) {
      console.error("orderId 가져오기 실패:", error);
    }
    return null;
  };

  if (paymentState.orderItems.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <div className={styles.emptyBox}>
          <p className={styles.emptyTitle}>결제할 상품이 없습니다.</p>
          <p className={styles.emptySub}>
            장바구니에서 다시 주문을 진행해 주세요.
          </p>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => navigate("/cart")}
          >
            장바구니로 이동
          </button>
        </div>
      </div>
    );
  }

  const productTotal = paymentState.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const finalAmount = Math.max(
    0,
    productTotal +
      paymentState.shippingFee -
      paymentState.appliedCouponDiscount -
      paymentState.appliedPointsUsed,
  );

  return (
    <div className={styles.pageWrap}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.backBtn}
            aria-label="이전 페이지로 이동"
            onClick={() => navigate(-1)}
          >
            <span className={styles.iconArrow} aria-hidden />
          </button>
          <h1 className={styles.headerTitle}>결제하기</h1>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>주문 상품</h2>
          <div className={styles.itemsStack}>
            {paymentState.orderItems.map((item) => (
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
                    옵션 {item.size} · 수량 {item.quantity}개
                  </p>
                  <p className={styles.itemPrice}>
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>결제 금액</h2>
          <div className={styles.priceGroup}>
            <div className={styles.priceRowSm}>
              <span className={styles.muted}>상품 금액</span>
              <span className={styles.bold}>
                {formatCurrency(originalTotal || productTotal)}
              </span>
            </div>
            <div className={styles.priceRowSm}>
              <span className={styles.muted}>장바구니 할인</span>
              <span className={styles.minus}>
                - {formatCurrency(cartDiscount)}
              </span>
            </div>
            <div className={styles.priceRowSm}>
              <span className={styles.muted}>쿠폰 할인</span>
              <span className={styles.minus}>
                - {formatCurrency(paymentState.appliedCouponDiscount)}
              </span>
            </div>
            <div className={styles.priceRowSm}>
              <span className={styles.muted}>포인트 사용</span>
              <span className={styles.minus}>
                - {formatCurrency(paymentState.appliedPointsUsed)}
              </span>
            </div>
            <div className={styles.priceRowSm}>
              <span className={styles.muted}>배송비</span>
              <span className={styles.bold}>
                {paymentState.shippingFee === 0 ? (
                  <span className={styles.free}>무료</span>
                ) : (
                  formatCurrency(paymentState.shippingFee)
                )}
              </span>
            </div>
          </div>
          <div className={styles.totalWrap}>
            <div className={styles.totalBar}>
              <span className={styles.totalLabel}>총 결제 금액</span>
              <span className={styles.totalPay}>
                {formatCurrency(finalAmount)}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>결제 수단</h2>
          <div className={styles.tileGrid}>
            <button
              type="button"
              className={`${styles.tile} ${method === "card" ? styles.tileSelected : ""}`}
              onClick={() => handleMethodChange("card")}
            >
              <div className={styles.tileHead}>
                <div className={styles.tileLeft}>
                  <span
                    className={`${styles.radioDot} ${method === "card" ? styles.radioDotOn : ""}`}
                    aria-hidden
                  />
                  <span className={styles.tileLabel}>신용/체크카드</span>
                </div>
              </div>
              <p className={styles.tileDesc}>국내 주요 카드로 결제합니다.</p>
            </button>

            <button
              type="button"
              className={`${styles.tile} ${method === "simple" ? styles.tileSelected : ""}`}
              onClick={() => handleMethodChange("simple")}
            >
              <div className={styles.tileHead}>
                <div className={styles.tileLeft}>
                  <span
                    className={`${styles.radioDot} ${method === "simple" ? styles.radioDotOn : ""}`}
                    aria-hidden
                  />
                  <span className={styles.tileLabel}>간편결제</span>
                </div>
              </div>
              <p className={styles.tileDesc}>
                카카오페이, 네이버페이 등을 이용합니다.
              </p>
            </button>

            <button
              type="button"
              className={`${styles.tile} ${method === "transfer" ? styles.tileSelected : ""}`}
              onClick={() => handleMethodChange("transfer")}
            >
              <div className={styles.tileHead}>
                <div className={styles.tileLeft}>
                  <span
                    className={`${styles.radioDot} ${method === "transfer" ? styles.radioDotOn : ""}`}
                    aria-hidden
                  />
                  <span className={styles.tileLabel}>계좌이체</span>
                </div>
              </div>
              <p className={styles.tileDesc}>
                무통장 입금 또는 즉시이체를 이용합니다.
              </p>
            </button>
          </div>
        </section>

        {method === "card" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>카드 정보 입력</h2>
            <div className={styles.formStack}>
              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="card-company">
                  카드사 선택 <span className={styles.req}>*</span>
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id="card-company"
                    value={cardInfo.company}
                    onChange={(event) =>
                      setCardInfo((prev) => ({
                        ...prev,
                        company: event.target.value,
                      }))
                    }
                    className={styles.select}
                  >
                    <option value="">카드사를 선택하세요</option>
                    {CARD_COMPANIES.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                  <span className={styles.chevDown} aria-hidden />
                </div>
              </div>

              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="card-number">
                  카드 번호 <span className={styles.req}>*</span>
                </label>
                <input
                  id="card-number"
                  className={styles.input}
                  inputMode="numeric"
                  maxLength={19}
                  value={cardInfo.number}
                  onChange={(event) =>
                    setCardInfo((prev) => ({
                      ...prev,
                      number: event.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 16)
                        .replace(/(.{4})/g, "$1 ")
                        .trim(),
                    }))
                  }
                  placeholder="0000 0000 0000 0000"
                />
              </div>

              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="card-expiry">
                  유효기간 (MMYY) <span className={styles.req}>*</span>
                </label>
                <input
                  id="card-expiry"
                  className={styles.input}
                  inputMode="numeric"
                  maxLength={4}
                  value={cardInfo.expiry}
                  onChange={(event) =>
                    setCardInfo((prev) => ({
                      ...prev,
                      expiry: event.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 4),
                    }))
                  }
                  placeholder="MMYY"
                />
              </div>

              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="card-cvc">
                  CVC <span className={styles.req}>*</span>
                </label>
                <input
                  id="card-cvc"
                  className={styles.input}
                  inputMode="numeric"
                  maxLength={3}
                  value={cardInfo.cvc}
                  onChange={(event) =>
                    setCardInfo((prev) => ({
                      ...prev,
                      cvc: event.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 3),
                    }))
                  }
                  placeholder="3자리"
                />
              </div>

              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="card-installment">
                  할부 기간
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id="card-installment"
                    value={cardInfo.installment}
                    onChange={(event) =>
                      setCardInfo((prev) => ({
                        ...prev,
                        installment: event.target.value,
                      }))
                    }
                    className={styles.select}
                  >
                    {INSTALLMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className={styles.chevDown} aria-hidden />
                </div>
              </div>
            </div>
          </section>
        )}

        {method === "simple" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>간편결제 선택</h2>
            <div className={styles.simpleGrid}>
              {(
                [
                  { value: "kakao", label: "카카오페이" },
                  { value: "naver", label: "네이버페이" },
                ] as Array<{ value: SimpleService; label: string }>
              ).map((service) => (
                <button
                  key={service.value}
                  type="button"
                  className={`${styles.simpleBtn} ${
                    simpleService === service.value ? styles.simpleBtnOn : ""
                  }`}
                  onClick={() => setSimpleService(service.value)}
                >
                  <span
                    className={
                      service.value === "kakao"
                        ? styles.kakaoDot
                        : styles.naverDot
                    }
                    aria-hidden
                  />
                  <span>{service.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {method === "transfer" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>계좌이체 정보</h2>
            <div className={styles.formStack}>
              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="bank-select">
                  입금 은행 선택 <span className={styles.req}>*</span>
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id="bank-select"
                    value={bankInfo.bank}
                    onChange={(event) =>
                      setBankInfo((prev) => ({
                        ...prev,
                        bank: event.target.value,
                      }))
                    }
                    className={styles.select}
                  >
                    <option value="">은행을 선택하세요</option>
                    {BANK_OPTIONS.map((bank) => (
                      <option key={bank.value} value={bank.value}>
                        {bank.label}
                      </option>
                    ))}
                  </select>
                  <span className={styles.chevDown} aria-hidden />
                </div>
              </div>

              <div className={styles.formItem}>
                <label className={styles.label} htmlFor="bank-depositor">
                  입금자명 <span className={styles.req}>*</span>
                </label>
                <input
                  id="bank-depositor"
                  className={styles.input}
                  value={bankInfo.depositorName}
                  onChange={(event) =>
                    setBankInfo((prev) => ({
                      ...prev,
                      depositorName: event.target.value,
                    }))
                  }
                  placeholder="입금자 이름을 입력하세요"
                />
              </div>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>결제 동의</h2>
          <button
            type="button"
            className={styles.agreeItem}
            onClick={() => handleAllAgreement(!allAgreementsChecked)}
            aria-pressed={allAgreementsChecked}
          >
            <span
              className={`${styles.checkSquare} ${
                allAgreementsChecked ? styles.checkOn : ""
              }`}
              aria-hidden
            />
            <div className={styles.agreeTexts}>
              <p className={styles.agreeTitle}>전체 동의</p>
              <p className={styles.agreeSub}>
                아래 필수 항목에 모두 동의합니다.
              </p>
            </div>
          </button>

          {AGREEMENTS.map((agreement) => (
            <button
              key={agreement.key}
              type="button"
              className={styles.agreeItem}
              onClick={() => toggleAgreement(agreement.key)}
              aria-pressed={agreements[agreement.key]}
            >
              <span
                className={`${styles.checkSquare} ${
                  agreements[agreement.key] ? styles.checkOn : ""
                }`}
                aria-hidden
              />
              <div className={styles.agreeTexts}>
                <p className={styles.agreeTitle}>{agreement.label}</p>
                <p className={styles.agreeSub}>{agreement.description}</p>
              </div>
            </button>
          ))}
        </section>
      </main>

      <div className={styles.fixedBar}>
        <div className={styles.fixedInner}>
          <div className={styles.fixedRight}>
            <p className={styles.fixedMeta}>
              총 {paymentState.orderItems.length}개 상품
            </p>
            <p className={styles.fixedPrice}>{formatCurrency(finalAmount)}</p>
          </div>
          <button
            type="button"
            onClick={handlePayment}
            disabled={!isFormValid}
            className={`${styles.payButton} ${isFormValid ? "" : styles.payButtonDisabled}`}
          >
            {isProcessing
              ? "결제 처리 중..."
              : `${formatCurrency(finalAmount)} 결제하기`}
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalIconWrap}>
              <span className={styles.modalIcon} aria-hidden />
            </div>
            <h3 className={styles.modalTitle}>결제가 완료되었습니다.</h3>
            <p className={styles.modalSub}>주문 내역 페이지로 이동합니다.</p>
            <div className={styles.spinnerSmall} aria-hidden />
          </div>
        </div>
      )}
    </div>
  );
}
