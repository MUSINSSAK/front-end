import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type PaymentSuccessState = {
  paymentId: string;
  txId: string; // V2 API에서는 txId 사용
  orderId: string;
  orderNumber?: string; // 백엔드에서 받은 주문번호
  finalAmount?: number; // 최종 결제금액
  error?: string; // 에러 메시지 (백엔드 처리 실패시)
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentSuccessState | null>(
    null,
  );

  useEffect(() => {
    const state = location.state as PaymentSuccessState;
    console.log("전달받은 state:", state); // 디버깅용

    if (state?.paymentId && state?.txId && state?.orderId) {
      setPaymentData(state);
      console.log("결제 완료 정보:", state);
    } else {
      console.error("결제 완료 정보가 없습니다. state:", state);
    }
  }, [location.state]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoToOrders = () => {
    navigate("/mypage/order"); // 주문 내역 페이지로 이동
  };

  if (!paymentData) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1>결제 정보를 확인할 수 없습니다</h1>
        <p>결제 과정에서 오류가 발생했습니다.</p>
        <button
          type="button"
          onClick={handleGoHome}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          홈으로 가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* 성공 아이콘 */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#27ae60",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "white",
            fontSize: "40px",
          }}
        >
          ✓
        </div>
        <h1 style={{ color: "#27ae60", marginBottom: "10px" }}>
          결제가 완료되었습니다!
        </h1>
        <p style={{ fontSize: "16px", color: "#666" }}>
          주문이 정상적으로 처리되었습니다.
        </p>
      </div>

      {/* 결제 정보 */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h2 style={{ marginBottom: "15px", fontSize: "18px" }}>결제 정보</h2>
        <div style={{ marginBottom: "10px" }}>
          <span
            style={{
              fontWeight: "bold",
              display: "inline-block",
              width: "120px",
            }}
          >
            주문번호:
          </span>
          <span>{paymentData.orderId}</span>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <span
            style={{
              fontWeight: "bold",
              display: "inline-block",
              width: "120px",
            }}
          >
            결제번호:
          </span>
          <span>{paymentData.paymentId}</span>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <span
            style={{
              fontWeight: "bold",
              display: "inline-block",
              width: "120px",
            }}
          >
            포트원 거래번호:
          </span>
          <span>{paymentData.txId}</span>
        </div>
        {paymentData.finalAmount && (
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontWeight: "bold",
                display: "inline-block",
                width: "120px",
              }}
            >
              결제금액:
            </span>
            <span>{paymentData.finalAmount.toLocaleString()}원</span>
          </div>
        )}
        {paymentData.error && (
          <div
            style={{
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "4px",
            }}
          >
            <span style={{ color: "#856404", fontWeight: "bold" }}>
              ⚠️ 주의:{" "}
            </span>
            <span style={{ color: "#856404" }}>
              결제는 완료되었으나 주문 처리 중 일부 오류가 발생했습니다.
              고객센터에 문의해주세요.
            </span>
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginBottom: "15px", fontSize: "18px" }}>배송 안내</h2>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
          <li>
            주문하신 상품은 결제 완료 후 1-2일 내에 배송 준비가 완료됩니다.
          </li>
          <li>배송 준비가 완료되면 SMS로 배송 시작 안내를 보내드립니다.</li>
          <li>
            배송 조회는 마이페이지 &gt; 주문내역에서 확인하실 수 있습니다.
          </li>
          <li>배송 관련 문의사항은 고객센터(1588-0000)로 연락주세요.</li>
        </ul>
      </div>

      {/* 버튼 그룹 */}
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          type="button"
          onClick={handleGoToOrders}
          style={{
            flex: 1,
            padding: "15px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          주문내역 보기
        </button>
        <button
          type="button"
          onClick={handleGoHome}
          style={{
            flex: 1,
            padding: "15px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#95a5a6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
