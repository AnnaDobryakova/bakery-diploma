import { Box, Button, Typography } from "@mui/material";

export default function CartStep({
  cartItems,
  isAuth,
  onProceed,
  onGoLogin,
  onSubmitOrder,
}) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async () => {
    // тут ты соберёшь данные из формы (имя, телефон, т.д.) и отправишь
    await onSubmitOrder?.({ /* orderData */ });
  };

  return (
    <Box sx={{ display: "flex", gap: 4 }}>
      {/* Левая часть — корзина */}
      <Box sx={{ flex: 1, bgcolor: "#FAF3EA", borderRadius: "24px", p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Корзина
        </Typography>

        {/* Тут рендеришь товары */}
        {cartItems.map((item) => (
          <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography>{item.title} × {item.qty}</Typography>
            <Typography>{item.price * item.qty} ₽</Typography>
          </Box>
        ))}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 700 }}>Итого:</Typography>
          <Typography sx={{ fontWeight: 700 }}>{total} ₽</Typography>
        </Box>

        <Button
          variant="contained"
          onClick={onProceed}
          sx={{ mt: 3, borderRadius: "999px", width: "100%" }}
        >
          Оформить заказ
        </Button>
      </Box>

      {/* Правая часть — оформление */}
      <Box sx={{ flex: 1, borderRadius: "24px", p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Оформление заказа
        </Typography>

        {!isAuth ? (
          <>
            <Typography sx={{ mb: 2 }}>
              Чтобы оформить заказ, нужно войти в аккаунт.
            </Typography>
            <Button variant="contained" onClick={onGoLogin} sx={{ borderRadius: "999px" }}>
              Войти
            </Button>
          </>
        ) : (
          <>
            {/* Тут будут твои TextField / Checkbox */}
            <Typography sx={{ mb: 2 }}>Тут будет форма (имя, телефон, согласие)</Typography>
            <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: "999px" }}>
              ОФОРМИТЬ ЗАКАЗ
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}