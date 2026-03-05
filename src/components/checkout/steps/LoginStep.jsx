import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function LoginStep({ onSuccess, onGoRegister }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await onSuccess?.(phone, password);
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Авторизация
      </Typography>

      <Box sx={{ display: "grid", gap: 2, maxWidth: 360, mx: "auto" }}>
        <TextField value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Номер телефона" />
        <TextField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" type="password" />

        <Button variant="contained" onClick={handleLogin} sx={{ borderRadius: "999px" }}>
          ВОЙТИ
        </Button>

        <Button variant="text" onClick={onGoRegister}>
          Нет аккаунта? Зарегистрироваться
        </Button>
      </Box>
    </Box>
  );
}