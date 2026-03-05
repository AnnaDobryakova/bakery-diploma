import { useMemo, useState } from "react";
import { Modal, Box } from "@mui/material";
import CartStep from "./steps/CartStep";
import LoginStep from "./steps/LoginStep";
import RegisterStep from "./steps/RegisterStep";

export default function CheckoutModal({
  open,
  onClose,
  cartItems = [],
  isAuth = false,
  onLogin,      // async (phone, pass) => ...
  onRegister,   // async (data) => ...
  onSubmitOrder // async (orderData) => ...
}) {
  // cart | login | register
  const [step, setStep] = useState("cart");

  // чтобы при открытии модалки шаг был логичный
  useMemo(() => {
    if (!open) return;
    setStep(isAuth ? "cart" : "login"); // можно начинать с корзины, но если не авторизован — логин
  }, [open, isAuth]);

  const goCart = () => setStep("cart");
  const goLogin = () => setStep("login");
  const goRegister = () => setStep("register");

  const handleClose = () => {
    setStep("cart");
    onClose?.();
  };

  const handleProceedCheckout = () => {
    // нажали "Оформить"
    if (!isAuth) return goLogin();
    // если авторизован — остаёмся на cart и показываем форму оформления (у тебя на макете она справа)
  };

  const handleLoginSuccess = async (phone, password) => {
    await onLogin?.(phone, password);
    goCart(); // вернулись в оформление
  };

  const handleRegisterSuccess = async (data) => {
    await onRegister?.(data);
    // обычно после регистрации сразу авторизуют. Если у тебя так — возвращайся в cart:
    goCart();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          maxWidth: "95vw",
          bgcolor: "background.paper",
          borderRadius: "32px",
          outline: "none",
          p: 4,
        }}
      >
        {step === "cart" && (
          <CartStep
            cartItems={cartItems}
            isAuth={isAuth}
            onProceed={handleProceedCheckout}
            onGoLogin={goLogin}
            onSubmitOrder={onSubmitOrder}
          />
        )}

        {step === "login" && (
          <LoginStep
            onClose={handleClose}
            onSuccess={handleLoginSuccess}
            onGoRegister={goRegister}
          />
        )}

        {step === "register" && (
          <RegisterStep
            onClose={handleClose}
            onSuccess={handleRegisterSuccess}
            onGoLogin={goLogin}
          />
        )}
      </Box>
    </Modal>
  );
}