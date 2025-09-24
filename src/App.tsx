import { Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { ChatWidget } from "./components/organisms";
import { MainTemplate } from "./components/templates";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ModalProvider } from "./contexts/ModalContext";
import { ToastProvider } from "./contexts/ToastContext";
import { useTokenExpirationCheck } from "./hooks/useTokenExpirationCheck";
import {
  Cart,
  Category,
  FindPassword,
  Home,
  Login,
  Mypage,
  Order,
  Payment,
  PaymentSuccess,
  ProductDetail,
  ProductInquiry,
  SignUp,
} from "./pages";

function GlobalAppSetup() {
  useTokenExpirationCheck();
  return null;
}

export default function App() {
  return (
    <div className={styles.app}>
      <ToastProvider>
        <CategoryProvider>
          <ModalProvider>
            <GlobalAppSetup />
            <MainTemplate>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/find-password" element={<FindPassword />} />
                <Route path="/category/:cat" element={<Category />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route
                  path="/products/:id/inquiry"
                  element={<ProductInquiry />}
                />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/order" element={<Order />} />
                <Route path="/mypage/:tab?" element={<Mypage />} />
              </Routes>

              <ChatWidget />
            </MainTemplate>
          </ModalProvider>
        </CategoryProvider>
      </ToastProvider>
    </div>
  );
}
