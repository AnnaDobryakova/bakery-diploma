import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ProfileEditModal from "../modals/ProfileEditModal";
import CheckoutModal from "../modals/CheckoutModal";


const statusMap = {
  new: "Новый",
  in_progress: "Готовится",
  ready: "Готов к выдаче",
  completed: "Завершён",
  cancelled: "Отменён",
};

const AccountPage = ({ cartItems, removeFromCart, changeQuantity, clearCart }) => {
  const { user } = useAuth();

  const userOrders = useMemo(() => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    return allOrders.filter((order) => order.userEmail === user?.email);
  }, [user]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
    };

    const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    };

    const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Header onCartClick={handleOpenCheckout} cartItems={cartItems}/>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "80px",
          px: 6,
          pt: '150px',
          pb: 10,
          minHeight: "70vh",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            width: "420px",
            backgroundColor: "#fff",
            borderRadius: "24px",
            p: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
            Личный кабинет
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Typography sx={{ fontSize: "20px" }}>
              <strong>Имя:</strong> {user?.name}
            </Typography>
            <Typography sx={{ fontSize: "20px" }}>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography sx={{ fontSize: "20px" }}>
              <strong>Телефон:</strong> {user?.phone}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => setIsEditModalOpen(true)}
            sx={{
              mt: 4,
              color: "white",
              backgroundColor: "#FD8719",
              borderRadius: "999px",
              width: "100%",
              fontSize: "16px",
              py: 1.5,
              textTransform: "none",
            }}
          >
            Редактировать профиль
          </Button>
        </Box>

        <Box
          sx={{
            width: "420px",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Мои заказы
          </Typography>

          {userOrders.length === 0 ? (
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "24px",
                p: 4,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              }}
            >
              <Typography>У вас пока нет заказов</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                maxHeight: 480,
                overflowY: "auto",
                pr: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {userOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    backgroundColor: "#fff",
                    padding: "18px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    Заказ №{order.id}
                  </Typography>
                  <Typography>Сумма: {order.total} ₽</Typography>
                  <Typography>
                    Статус: {statusMap[order.status] || order.status || "Новый"}
                  </Typography>
                  <Typography>
                    Дата: {new Date(order.createdAt).toLocaleString("ru-RU")}
                  </Typography>
                  <Typography>
                    Самовывоз: {order.pickupTime 
                      ? new Date(order.pickupTime).toLocaleString("ru-RU") 
                      : "Не указано"}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

      </Box>

      <Footer />

      <ProfileEditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={handleCloseCheckout}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        changeQuantity={changeQuantity}
        clearCart={clearCart}
    />
    </>
  );
};

export default AccountPage;