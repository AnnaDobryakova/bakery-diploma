import { useAuth } from "../context/AuthContext";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileEditModal from "../modals/ProfileEditModal";
import CheckoutModal from "../modals/CheckoutModal";
import { getOrdersByUserFromStorage } from "../utils/storage";

const statusMap = {
  new: "Новый",
  in_progress: "Готовится",
  ready: "Готов к выдаче",
  completed: "Выдан",
  cancelled: "Отменён",
};

const AccountPage = ({ cartItems, removeFromCart, changeQuantity, clearCart }) => {
  const { user } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
  };

  useEffect(() => {
    if (!user?.email) {
      setUserOrders([]);
      return;
    }

    const orders = getOrdersByUserFromStorage(user.email).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setUserOrders(orders);
  }, [user, checkoutOpen]);

  return (
    <>
      <Header onCartClick={handleOpenCheckout} cartItems={cartItems} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "80px",
          px: 6,
          pt: "150px",
          pb: 10,
          minHeight: "70vh",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            width: "360px",
            backgroundColor: "#fff",
            borderRadius: "28px",
            p: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Личный кабинет
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <strong>Имя:</strong> {user?.name || "Не указано"}
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <strong>Email:</strong> {user?.email || "Не указано"}
          </Typography>

          <Typography sx={{ mb: 3 }}>
            <strong>Телефон:</strong> {user?.phone || "Не указано"}
          </Typography>

          <Box
            onClick={() => setIsEditModalOpen(true)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              px: 3,
              py: 1.5,
              borderRadius: "64px",
              backgroundColor: "#FD8719",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            Редактировать профиль
          </Box>
        </Box>

        <Box
          sx={{
            width: "min(760px, 100%)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
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
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>
                    Заказ №{order.id}
                  </Typography>

                  <Typography sx={{ mb: 0.5 }}>
                    Сумма: {order.total || 0} ₽
                  </Typography>

                  <Typography sx={{ mb: 0.5 }}>
                    Статус: {statusMap[order.status] || order.status || "Новый"}
                  </Typography>

                  <Typography sx={{ mb: 0.5 }}>
                    Дата создания:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("ru-RU")
                      : "Не указано"}
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    Самовывоз:{" "}
                    {order.pickupTime
                      ? new Date(order.pickupTime).toLocaleString("ru-RU")
                      : "Не указано"}
                  </Typography>

                  {!!order.items?.length && (
                    <Box sx={{ mt: 1 }}>
                      <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                        Состав заказа:
                      </Typography>

                      {order.items.map((item, index) => (
                        <Typography key={`${item.id}-${index}`} sx={{ fontSize: 14 }}>
                          {item.name} × {item.quantity}
                        </Typography>
                      ))}
                    </Box>
                  )}
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