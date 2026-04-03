import { Box, Typography, Button, TextField } from "@mui/material";
import ModalWrapper from "../modals/ModalWrapper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { createOrder } from "../api/ordersApi";
import { getPromotions } from "../api/promotionsApi";
import { applyPromotions } from "../utils/promotionEngine";

dayjs.locale("ru");


const CheckoutModal = ({ open, onClose, cartItems = [], removeFromCart, changeQuantity, clearCart}) => {

  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [promoCode, setPromoCode] = useState("");

  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const pricing = useMemo(() => {
  return applyPromotions({
    promotions,
    cartItems,
    promoCode,
  });
}, [promotions, cartItems, promoCode]);

  useEffect(() => {
  const loadPromotions = async () => {
    try {
      const data = await getPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Ошибка загрузки акций:", error);
      setPromotions([]);
    }
  };

  if (open) {
    loadPromotions();
  }
}, [open]);


const handleCheckout = async () => {
  if (!cartItems.length) {
    setSubmitError("Корзина пуста");
    return;
  }

  if (!pickupTime) {
    setSubmitError("Пожалуйста, выберите время самовывоза");
    return;
  }

  try {
    const orderData = {
      client: {
        fullName: user?.name || "Гость",
        phone: user?.phone || "",
        email: user?.email || "",
      },
      pickupTime: pickupTime ? new Date(pickupTime).toISOString() : null,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      subtotalAmount: pricing.subtotal,
      discountAmount: pricing.discountAmount,
      totalAmount: pricing.finalTotal,
      promotionTitle: pricing.appliedPromotion?.title || null,
      promoCode: pricing.appliedPromotion?.promoCode || null,
      giftLabel: pricing.giftLabel || null,
      comment: "",
    };

    const savedOrder = await createOrder(orderData);

    if (!savedOrder) {
      setSubmitError("Не удалось оформить заказ. Попробуйте снова.");
      return;
    }

    clearCart();
    setSubmitError("");
    onClose();

    navigate("/order-success", {
      state: { orderId: savedOrder.id },
    });
  } catch (error) {
    console.error("Ошибка оформления заказа:", error);
    setSubmitError("Не удалось оформить заказ. Попробуйте снова.");
  }
};

  return (
    <ModalWrapper open={open} onClose={onClose} maxWidth={980} padding={0}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr" },
          minHeight: { xs: "auto", md: 520 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            bgcolor: "#FFF7EF",
            p: { xs: 2, sm: 3, md: 5 },
            borderRadius: "16px",
          }}
        >
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
            Корзина
          </Typography>

          <Box
            sx={{
              borderTop: "1px solid rgba(0,0,0,0.4)",
              pt: 2,
              maxHeight: { xs: 220, md: 280 },
              overflowY: "auto",
              pr: 1,
            }}
          >
            {cartItems.length === 0 ? (
              <Typography sx={{ opacity: 0.7 }}>Корзина пуста</Typography>
            ) : (
              cartItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "52px 1fr", sm: "52px 1fr auto" },
                    alignItems: "center",
                    gap: 1.5,
                    py: 2,
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Box
                    component="img"
                    src={item.imageURL}
                    alt={item.name}
                    sx={{ width: 52, height: 52, borderRadius: 2, objectFit: "cover" }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "15px", md: "18px" },
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{
                        opacity: 0.7,
                        fontSize: { xs: "14px", md: "16px" },
                      }}
                    >
                      {item.price} ₽
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifySelf: { xs: "start", sm: "end" },
                      mt: { xs: 1, sm: 0 },
                    }}
                    className="menu_count"
                  >
                    <button className="menu_btn"  onClick={() => changeQuantity(item.id, -1)}>
                      <RemoveIcon sx={{ fontSize: 20  }} />
                    </button>
                    <Typography className="menu_number">{item.quantity}</Typography>
                    <button className="menu_btn" type="button" onClick={() => changeQuantity(item.id, 1)}>
                      <AddIcon sx={{ fontSize: 20 }} />
                    </button>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <Box sx={{ mt: 3  }}>
             
              <DateTimePicker
                label="Время самовывоза"
                value={pickupTime}
                onChange={(newValue) => setPickupTime(newValue)}
                format="DD.MM.YYYY HH:mm"
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </LocalizationProvider>

          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Промокод"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Введите промокод, если он есть"
            />
          </Box>

          {submitError && (
              <Typography sx={{ color: "#d32f2f", fontSize: 13, mt: 1 }}>
                {submitError}
              </Typography>
            )}

            {pricing.promoError && (
              <Typography sx={{ color: "#d32f2f", fontSize: 13, mt: 1 }}>
                {pricing.promoError}
              </Typography>
            )}

          <Box sx={{ mt: 3, display: "grid", gap: 1.2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Сумма товаров:</Typography>
              <Typography>{pricing.subtotal} ₽</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Скидка:</Typography>
              <Typography color={pricing.discountAmount > 0 ? "#2e7d32" : "inherit"}>
                - {pricing.discountAmount} ₽
              </Typography>
            </Box>

            {pricing.appliedPromotion && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Акция:</Typography>
                <Typography sx={{ textAlign: "right", maxWidth: 220 }}>
                  {pricing.appliedPromotion.title}
                </Typography>
              </Box>
            )}

            {pricing.giftLabel && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Подарок:</Typography>
                <Typography sx={{ textAlign: "right", maxWidth: 220 }}>
                  {pricing.giftLabel}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Итого:
              </Typography>
              <Typography variant="h6">
                {pricing.finalTotal} ₽
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={handleCheckout}
            disabled={!cartItems.length}
            variant="contained"
            type="button"
            sx={{
              backgroundColor: "#FD8719",
              borderRadius: "64px",
              textTransform: "initial",
              width: "100%",
              mt: 2,
              height: { xs: "46px", md: "52px" },
              fontSize: { xs: "15px", md: "17px" },
            }}
          >
            Оформить заказ
          </Button>


            <AuthModal
              open={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
            />
          </Box>
      </Box>
    </ModalWrapper>
  );
};

export default CheckoutModal;