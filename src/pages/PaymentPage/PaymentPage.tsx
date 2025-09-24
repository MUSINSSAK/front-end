import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPaymentInfo,
  type PaymentInfoResponse,
  requestPayment,
} from "../../api/payments";

// 포트원 SDK 타입 선언
declare global {
  interface Window {
    IMP: {
      init: (merchantId: string) => void;
      request_pay: (
        params: ImpPaymentParams,
        callback: (response: ImpPaymentResponse) => void,
      ) => void;
    };
  }
}

type ImpPaymentParams = {
  pg: string;
  merchant_uid: string;
  name: string;
  amount: number;
  buyer_name: string;
  buyer_email: string;
};

type ImpPaymentResponse = {
  success: boolean;
  error_msg?: string;
  merchant_uid?: string;
  imp_uid?: string;
};

const PaymentPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 결제 정보 로드
  useEffect(() => {
    if (!orderId) {
      setError("주문 ID가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchPaymentInfo = async () => {
      try {
        const data = await getPaymentInfo(orderId);
        setPaymentInfo(data);
      } catch (err) {
        console.error("결제 정보 조회 실패:", err);
        setError("결제 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [orderId]);

  // 결제 실행
  const handlePayment = async () => {
    if (!orderId || !paymentInfo) return;

    setPaying(true);
    setError(null);

    try {
      // 1. 백엔드에 결제 요청
      const paymentData = await requestPayment(orderId);

      // 2. 포트원 결제창 호출
      if (!window.IMP) {
        throw new Error("포트원 SDK가 로드되지 않았습니다.");
      }

      window.IMP.init(paymentData.merchantId);

      window.IMP.request_pay(
        {
          pg: "portone",
          merchant_uid: paymentData.paymentId,
          name: paymentData.orderName,
          amount: paymentData.totalAmount,
          buyer_name: paymentData.customerName,
          buyer_email: paymentData.customerEmail,
        },
        (response: ImpPaymentResponse) => {
          if (response.success) {
            // 결제 성공
            console.log("결제 성공:", response);
            navigate("/payment/success", {
              state: {
                paymentId: paymentData.paymentId,
                impUid: response.imp_uid,
                orderId: orderId,
              },
            });
          } else {
            // 결제 실패
            console.error("결제 실패:", response.error_msg);
            setError(`결제 실패: ${response.error_msg}`);
            setPaying(false);
          }
        },
      );
    } catch (err) {
      console.error("결제 요청 실패:", err);
      setError("결제 요청에 실패했습니다. 다시 시도해주세요.");
      setPaying(false);
    }
  };

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("ko-KR")}원`;

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>결제 정보를 불러오는 중...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>오류 발생</h2>
        <p style={{ color: "red" }}>{error}</p>
        <button type="button" onClick={() => navigate("/order")}>
          주문 페이지로 돌아가기
        </button>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>결제 정보를 찾을 수 없습니다.</h2>
        <button type="button" onClick={() => navigate("/order")}>
          주문 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>결제하기</h1>

      {/* 주문 정보 */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>주문 정보</h2>
        <p>
          <strong>주문번호:</strong> {paymentInfo.orderId}
        </p>
        <p>
          <strong>남은 시간:</strong> {paymentInfo.remainingTime}
        </p>
      </div>

      {/* 배송 정보 */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>배송 정보</h2>
        <p>
          <strong>받는분:</strong> {paymentInfo.deliveryInfo.recipient}
        </p>
        <p>
          <strong>연락처:</strong> {paymentInfo.deliveryInfo.phone}
        </p>
        <p>
          <strong>주소:</strong> {paymentInfo.deliveryInfo.address}
        </p>
        {paymentInfo.deliveryInfo.detailAddress && (
          <p>
            <strong>상세주소:</strong> {paymentInfo.deliveryInfo.detailAddress}
          </p>
        )}
        <p>
          <strong>배송요청:</strong> {paymentInfo.deliveryInfo.deliveryRequest}
        </p>
      </div>

      {/* 주문 상품 */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>주문 상품</h2>
        {paymentInfo.orderItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "4px",
            }}
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.productName}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  marginRight: "15px",
                  borderRadius: "4px",
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
                {item.brandName}
              </p>
              <p style={{ margin: "0 0 5px 0" }}>{item.productName}</p>
              <p
                style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}
              >
                사이즈: {item.size} | 수량: {item.quantity}개
              </p>
              <p style={{ margin: "0", fontWeight: "bold" }}>
                {formatCurrency(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 결제 금액 */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h2>결제 금액</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          <span>최종 결제 금액</span>
          <span style={{ color: "#e74c3c" }}>
            {formatCurrency(paymentInfo.paymentSummary.finalAmount)}
          </span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        type="button"
        onClick={handlePayment}
        disabled={paying}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "white",
          backgroundColor: paying ? "#95a5a6" : "#e74c3c",
          border: "none",
          borderRadius: "8px",
          cursor: paying ? "not-allowed" : "pointer",
        }}
      >
        {paying
          ? "결제 진행 중..."
          : `${formatCurrency(paymentInfo.paymentSummary.finalAmount)} 결제하기`}
      </button>

      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
