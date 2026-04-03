import { Box, Typography, Button } from "@mui/material";
import { useState, useMemo } from "react";
import ModalWrapper from "../../modals/ModalWrapper";

const ProductModal = ({ product, open, onClose, addToCart }) => {
  const [active, setActive] = useState("price");
  const [mode, setMode] = useState("per100");

  const nutrients = useMemo(() => {
    if (!product) return null;

    if (mode === "per100") {
      return {
        calories: product.nutrition.calories,
        proteins: product.nutrition.proteins,
        fats: product.nutrition.fats,
        carbs: product.nutrition.carbs,
      };
    }

    const k = product.weight / 100;
    return {
      calories: Math.round(product.nutrition.calories * k),
      proteins: +(product.nutrition.proteins * k).toFixed(1),
      fats: +(product.nutrition.fats * k).toFixed(1),
      carbs: +(product.nutrition.carbs * k).toFixed(1),
    };
  }, [mode, product]);

  if (!product || !nutrients) return null;

  return (
    <ModalWrapper open={open} onClose={onClose} padding="32px">
      <Box
        className="product-modal"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
          gap: { xs: 2.5, md: 4 },
          alignItems: "start",
          width: "100%",
        }}
      >
        <Box
          className="product-modal__image-wrap"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={product.imageURL}
            alt={product.name}
            className="product-modal__image"
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "auto",
              aspectRatio: "1 / 1",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
        </Box>

        <Box className="product-modal__content" sx={{ width: "100%" }}>
          <Typography
            id="product-title"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "32px", sm: "40px" },
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            {product.name}
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "24px", sm: "28px" },
              mb: 1,
            }}
          >
            Состав:
          </Typography>

          <Typography
            id="product-description"
            sx={{
              fontSize: { xs: "16px", sm: "18px" },
              lineHeight: 1.5,
              color: "#444",
              mb: 2.5,
            }}
          >
            {product.description}
          </Typography>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "24px", sm: "28px" },
              mb: 1.5,
            }}
          >
            Пищевая ценность
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setActive("price");
                setMode("per100");
              }}
              sx={{
                backgroundColor: active === "price" ? "#FD8719" : "#FFD8B3",
                color: active === "price" ? "#ffffff" : "#9A9A9A",
                borderRadius: "64px",
                textTransform: "initial",
                px: 2.5,
                py: 1,
                fontSize: { xs: "14px", sm: "16px" },
                boxShadow: "none",
              }}
            >
              100 г
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                setActive("all");
                setMode("total");
              }}
              sx={{
                backgroundColor: active === "all" ? "#FD8719" : "#FFD8B3",
                color: active === "all" ? "#ffffff" : "#9A9A9A",
                borderRadius: "64px",
                textTransform: "initial",
                px: 2.5,
                py: 1,
                fontSize: { xs: "14px", sm: "16px" },
                boxShadow: "none",
              }}
            >
              Весь продукт ({product.weight} гр)
            </Button>
          </Box>

          <Box
            className="product-modal__nutrients"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: { xs: 1.5, sm: 2 },
              mb: 3,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: { xs: "22px", sm: "26px" }, fontWeight: 700 }}>
                {nutrients.calories}
              </Typography>
              <Typography sx={{ fontSize: { xs: "13px", sm: "15px" }, color: "#666" }}>
                ккал
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: { xs: "22px", sm: "26px" }, fontWeight: 700 }}>
                {nutrients.proteins}
              </Typography>
              <Typography sx={{ fontSize: { xs: "13px", sm: "15px" }, color: "#666" }}>
                белки
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: { xs: "22px", sm: "26px" }, fontWeight: 700 }}>
                {nutrients.carbs}
              </Typography>
              <Typography sx={{ fontSize: { xs: "13px", sm: "15px" }, color: "#666" }}>
                углеводы
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ fontSize: { xs: "22px", sm: "26px" }, fontWeight: 700 }}>
                {nutrients.fats}
              </Typography>
              <Typography sx={{ fontSize: { xs: "13px", sm: "15px" }, color: "#666" }}>
                жиры
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ fontSize: { xs: "28px", sm: "36px" }, fontWeight: 500 }}>
              Итого:
            </Typography>
            <Typography
              id="product-price"
              sx={{ fontSize: { xs: "28px", sm: "40px" }, fontWeight: 700 }}
            >
              {product.price} ₽
            </Typography>
          </Box>

          <Button
            onClick={() => {
              if (product.remainder > 0) {
                addToCart(product);
                onClose();
              }
            }}
            disabled={product.remainder <= 0}
            variant="contained"
            sx={{
              backgroundColor: product.remainder <= 0 ? "#BDBDBD" : "#FD8719",
              borderRadius: "64px",
              textTransform: "initial",
              width: "100%",
              height: { xs: "46px", sm: "52px" },
              fontSize: { xs: "15px", sm: "17px" },
              boxShadow: "none",
            }}
          >
            {product.remainder <= 0 ? "Нет в наличии" : "Добавить в корзину"}
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};

export default ProductModal;