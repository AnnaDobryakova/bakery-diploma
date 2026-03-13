import { Box, Typography, Button, TextField } from "@mui/material";
import ModalWrapper from "../modals/ModalWrapper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { addOrderToStorage } from "../utils/storage";

dayjs.locale("ru");


const textFieldStyle = {
  "& .MuiInputLabel-root.Mui-focused": { color: "#FD8719" },

  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.35)" },
    "&.Mui-focused fieldset": { borderColor: "#FD8719" },

    "&.Mui-error fieldset": { borderColor: "#d32f2f" },
  },

  "& .MuiInputLabel-root.Mui-error": { color: "#d32f2f" },
  "& .MuiFormHelperText-root.Mui-error": { color: "#d32f2f" },
};

const CheckoutModal = ({ open, onClose, cartItems = [], removeFromCart, changeQuantity, clearCart}) => {


  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState(null);

  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

// const handleCheckout = () => {
//   setSubmitError("");

//   if (!cartItems.length) {
//     setSubmitError("Корзина пуста — добавьте товары, чтобы оформить заказ.");
//     return;
//   }

//   if (!isAuthenticated) {
//     setIsAuthModalOpen(true);
//     return;
//   }

//   if (!pickupTime) {
//     setSubmitError("Выберите дату и время самовывоза.");
//     return;
//   }
  
//   const orderNumber = Math.floor(1000 + Math.random() * 9000);

//   const newOrder = {
//     id: orderNumber,
//     userEmail: user?.email || "",
//     items: cartItems,
//     total,
//     createdAt: new Date().toISOString(),
//     status: "new",
//     pickupTime: pickupTime ? pickupTime.toISOString() : null
//   };

//   const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
//   localStorage.setItem("orders", JSON.stringify([...existingOrders, newOrder]));

//   clearCart();
//   onClose();

//   navigate("/order-success", {
//     state: { orderNumber },
//   });
// };

const handleCheckout = () => {
  if (!cartItems.length) {
    setSubmitError("Корзина пуста");
    return;
  }

  if (!pickupTime) {
    setSubmitError("Пожалуйста, выберите время самовывоза");
    return;
  }

  const order = {
    userEmail: user?.email || "",
    userName: user?.name || "",
    customerName: user?.name || "Гость",
    customerPhone: user?.phone || "",
    pickupTime: pickupTime ? new Date(pickupTime).toISOString() : null,
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    total,
    status: "new",
  };

  const savedOrder = addOrderToStorage(order);

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
};

  return (
    <ModalWrapper open={open} onClose={onClose} maxWidth={980} padding={0}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", minHeight: 520 }}>
        <Box sx={{ minWidth: '500px', bgcolor: "#FFF7EF", p: 5 }}>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
            Корзина
          </Typography>

          <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.4)", pt: 2, maxHeight: 280, overflowY: "auto", pr: 1, }}>
            {cartItems.length === 0 ? (
              <Typography sx={{ opacity: 0.7 }}>Корзина пуста</Typography>
            ) : (
              cartItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
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
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.7 }}>
                      {item.price} ₽
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} className="menu_count">
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

          {submitError && (
              <Typography sx={{ color: "#d32f2f", fontSize: 13, mt: 1 }}>
                {submitError}
              </Typography>
            )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
              Итого:
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {total} ₽
            </Typography>
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
                mt: 1,
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