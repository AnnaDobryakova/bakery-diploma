import { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";

export default function RegisterStep({ onSuccess, onGoLogin }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password2: "",
    agree: false,
  });

  const set = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: key === "agree" ? e.target.checked : e.target.value,
    }));

  const handleRegister = async () => {
    await onSuccess?.(form);
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Регистрация
      </Typography>

      <Box sx={{ display: "grid", gap: 2, maxWidth: 360, mx: "auto" }}>
        <TextField value={form.name} onChange={set("name")} placeholder="Имя" />
        <TextField value={form.phone} onChange={set("phone")} placeholder="Номер телефона" />
        <TextField value={form.email} onChange={set("email")} placeholder="Email" />
        <TextField value={form.password} onChange={set("password")} placeholder="Пароль" type="password" />
        <TextField value={form.password2} onChange={set("password2")} placeholder="Подтверждение пароля" type="password" />

        <FormControlLabel
          control={<Checkbox checked={form.agree} onChange={set("agree")} />}
          label="Я согласен(на) на обработку персональных данных"
        />

        <Button variant="contained" onClick={handleRegister} sx={{ borderRadius: "999px" }}>
          ЗАРЕГИСТРИРОВАТЬСЯ
        </Button>

        <Button variant="text" onClick={onGoLogin}>
          Уже есть аккаунт? Войти
        </Button>
      </Box>
    </Box>
  );
}