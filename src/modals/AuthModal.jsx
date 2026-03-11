import { useState } from "react";
import { useNavigate, } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModalWrapper from "./ModalWrapper";
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel } from "@mui/material";

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


const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const AuthModal = ({ open, onClose }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   const handleConsentChange = (e) => {
    const checked = e.target.checked;

    setForm((prev) => ({ ...prev, consent: checked }));
    setErrors((prev) => ({ ...prev, consent: "" }));
    setSubmitError("");
  };

  const validate = () => {
  const newErrors = {};
  setSubmitError("");

  if (mode === "register") {
    if (!form.name.trim()) newErrors.name = "Введите имя";
    if (!form.phone.trim()) newErrors.phone = "Введите телефон";
    if (!form.consent) newErrors.consent = "Нужно согласие на обработку данных";
  }

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

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    const isValid = validate();

    if (!isValid) return;

    if (mode === "login") {
      const result = login({
        email: form.email,
        password: form.password,
      });

      if (!result.success) {
        setSubmitError(result.message);
        return;
      }

      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      onClose();
    }

    if (mode === "register") {
      const result = register(form);

      if (!result.success) {
        setSubmitError(result.message);
        return;
      }

      alert("Регистрация прошла успешно");

      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      onClose();
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose} maxWidth={980} padding={0}>
        <Box sx={{ width: "100%", p: 5, bgcolor: "#fff" }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, mt: 2 }}>
                <Typography variant="h4">{mode === "login" ? "Вход" : "Регистрация"}</Typography>

                <Box style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '100%'}}>
                {mode === "register" && (
                    <TextField
                    label='Имя'
                    name="name"
                    variant="outlined"
                    sx={textFieldStyle}
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    />
                )}

                {mode === "register" && (
                    <TextField
                    label="Телефон"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    sx={textFieldStyle}
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone}
                    />
                )}

                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={textFieldStyle}
                    fullWidth
                />

                <TextField
                    label="Пароль"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={textFieldStyle}
                    fullWidth
                />

                {submitError && (
                    <Typography sx={{ color: "#d32f2f", fontSize: 14, mt: 1 }}>
                        {submitError}
                    </Typography>
                )}
                

                {mode === "register" && (
                    <FormControlLabel
                        control={<Checkbox checked={form.consent} onChange={handleConsentChange} />}
                        label="Я согласен(на) на обработку персональных данных"
                    />
                )}

                {mode === "register" && errors.consent && (
                    <Typography sx={{ color: "#d32f2f", fontSize: 12, mt: -1 }}>
                        {errors.consent}
                    </Typography>
                )}

                <Button variant="contained"
                    type="submit"
                    sx={{
                        backgroundColor: "#FD8719",
                        borderRadius: "64px",
                        textTransform: "initial",
                        width: "100%",
                        mt: 1,
                        fontSize: "20px",
                    }}
                >
                    {mode === "login" ? "Войти" : "Зарегистрироваться"}
                </Button>
                </Box>

                <Button
                type="button"
                variant="contained"
                sx={{
                    color: "#FD8719",
                    backgroundColor: "#fff",
                    borderRadius: "64px",
                    textTransform: "initial",
                    width: "100%",
                    mt: 1,
                    fontSize: "16px",
                }}
                onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                }
                >
                {mode === "login"
                    ? "Нет аккаунта? Зарегистрироваться"
                    : "Уже есть аккаунт? Войти"}
                </Button>

            </Box>
        </Box>
    </ModalWrapper>
  );
};

export default AuthModal;