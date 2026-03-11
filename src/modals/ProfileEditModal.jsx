import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ModalWrapper from "../modals/ModalWrapper";
import { useAuth } from "../context/AuthContext";

const textFieldStyle = {
  "& .MuiInputLabel-root.Mui-focused": { color: "#FD8719" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(0,0,0,0.25)",
    },
    "&:hover fieldset": {
      borderColor: "#FD8719",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FD8719",
    },
  },
};

const ProfileEditModal = ({ open, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && open) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
      });
      setErrors({});
    }
  }, [user, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Введите имя";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Введите телефон";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    const isValid = validate();
    if (!isValid) return;

    updateProfile({
      name: form.name,
      phone: form.phone,
    });

    onClose();
  };

  return (
    <ModalWrapper open={open} onClose={onClose} maxWidth={520} padding={0}>
      <Box sx={{ p: '40px', bgcolor: "#fff" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Редактировать профиль
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Имя"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            sx={textFieldStyle}
          />

          <TextField
            label="Телефон"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
            sx={textFieldStyle}
          />

          <TextField
            label="Email"
            value={user?.email || ""}
            fullWidth
            disabled
            sx={textFieldStyle}
          />

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#FD8719",
              borderRadius: "999px",
              textTransform: "none",
              mt: 1,
              py: 1.4,
              fontSize: "16px",
            }}
          >
            Сохранить изменения
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default ProfileEditModal;