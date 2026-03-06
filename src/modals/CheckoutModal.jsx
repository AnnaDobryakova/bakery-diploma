import { Box, Typography, Button, TextField, Checkbox, FormControlLabel } from "@mui/material";
import ModalWrapper from "../modals/ModalWrapper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";

const textFieldStyle = {
  "& .MuiInputLabel-root.Mui-focused": { color: "#FD8719" },

  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.35)" },
    "&.Mui-focused fieldset": { borderColor: "#FD8719" },

    // error рамка
    "&.Mui-error fieldset": { borderColor: "#d32f2f" },
  },

  "& .MuiInputLabel-root.Mui-error": { color: "#d32f2f" },
  "& .MuiFormHelperText-root.Mui-error": { color: "#d32f2f" },
};

const normalizeemail = (value) => value.replace(/[^\d+]/g, ""); // убираем пробелы/скобки/дефисы

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const CheckoutModal = ({ open, onClose, cartItems = [], removeFromCart, changeQuantity}) => {

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const handleConsentChange = (e) => {
    const checked = e.target.checked;

    setForm((prev) => ({ ...prev, consent: checked }));
    setErrors((prev) => ({ ...prev, consent: "" }));
    setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!cartItems.length) {
      setSubmitError("Корзина пуста — добавьте товары, чтобы оформить заказ.");
      return false;
    }

    if (!form.name.trim()) newErrors.name = "Введите имя";

    if (!form.email.trim()) {
      newErrors.email = "Введите email";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!form.password) {
      newErrors.password = "Введите пароль";
    } else if (form.password.length < 6) {
      newErrors.password = "Минимум 6 символов";
    }

    if (!form.consent) newErrors.consent = "Нужно согласие на обработку данных";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // тут потом будет создание заказа (localStorage / API)
    // сейчас просто закрываем модалку как подтверждение, что форма валидная
    onClose?.();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} maxWidth={980} padding={0}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", minHeight: 520 }}>
        {/* LEFT: корзина */}
        <Box sx={{ width: "50%", bgcolor: "#F6EFE8", p: 5 }}>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
            Корзина
          </Typography>

          <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.4)", pt: 2 }}>
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
                    src={imageURL}
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

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button className="menu_btn" type="button" onClick={() => changeQuantity(item.id, -1)}>
                      <RemoveIcon sx={{ fontSize: 20 }} />
                    </Button>
                    <Typography className="menu_number">{item.quantity}</Typography>
                    <Button className="menu_btn" type="button" onClick={() => changeQuantity(item.id, 1)}>
                      <AddIcon sx={{ fontSize: 20 }} />
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
              Итого:
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {total} ₽
            </Typography>
          </Box>
        </Box>

        {/* RIGHT: оформление */}
        <Box sx={{ width: "50%", p: 5, bgcolor: "#fff" }}>
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
            Оформление заказа
          </Typography>

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <TextField
              label="Имя"
              name="name"
              variant="outlined"
              sx={textFieldStyle}
              fullWidth
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              label="Email"
              name="email"
              variant="outlined"
              sx={textFieldStyle}
              fullWidth
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Пароль"
              name="password"
              type="password"
              variant="outlined"
              sx={textFieldStyle}
              fullWidth
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />

            <FormControlLabel
              control={<Checkbox checked={form.consent} onChange={handleConsentChange} />}
              label="Я согласен(на) на обработку персональных данных"
            />
            {errors.consent && (
              <Typography sx={{ color: "#d32f2f", fontSize: 12, mt: -1 }}>
                {errors.consent}
              </Typography>
            )}

            {submitError && (
              <Typography sx={{ color: "#d32f2f", fontSize: 13 }}>
                {submitError}
              </Typography>
            )}

            <Button
              disabled={!cartItems.length}
              variant="contained"
              type="submit"
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
          </Box>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default CheckoutModal;