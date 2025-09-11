import { Route, Routes } from "react-router-dom";
import styles from "./App.module.css";
import { ChatWidget } from "./components/organisms";
import { MainTemplate } from "./components/templates";
import { AuthProvider } from "./contexts/AuthContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ModalProvider } from "./contexts/ModalContext";
import { ToastProvider } from "./contexts/ToastContext";
import {
  Cart,
  Category,
  Home,
  Login,
  Mypage,
  Payment,
  ProductDetail,
  ProductInquiry,
  SignUp,
} from "./pages";

export default function App() {
  return (
    <div className={styles.app}>
      <ToastProvider>
        <AuthProvider>
          <CategoryProvider>
            <ModalProvider>
              <MainTemplate>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />

                  <Route path="/category/:cat" element={<Category />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route
                    path="/products/:id/inquiry"
                    element={<ProductInquiry />}
                  />

                  <Route path="/cart" element={<Cart />} />
                  <Route path="/payment" element={<Payment />} />

                  <Route path="/mypage/:tab?" element={<Mypage />} />
                </Routes>

                <ChatWidget />
              </MainTemplate>
            </ModalProvider>
          </CategoryProvider>
        </AuthProvider>
      </ToastProvider>
    </div>
  );
}
