import { Box, Typography } from "@mui/material";

const PromotionsSection = ({ promotions = [], id }) => {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        padding: { xs: "0 20px", md: "0 20px" },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          fontSize: { xs: "42px", md: "75px" },
          fontWeight: 500,
          mb: { xs: 4, md: 10 },
        }}
      >
        Акции
      </Typography>

      {promotions.length === 0 ? (
        <Box
          sx={{
            backgroundColor: "#FFF7EF",
            borderRadius: "20px",
            padding: { xs: "24px", md: "32px" },
            textAlign: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "18px", md: "22px" },
              lineHeight: 1.5,
              color: "#666",
            }}
          >
            Активных акций в данный момент нет
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "repeat(2, minmax(280px, 1fr))",
              lg: "repeat(3, minmax(280px, 1fr))",
            },
            gap: { xs: 3, md: 4 },
            alignItems: "stretch",
          }}
        >
          {promotions.map((promo) => (
            <Box
              key={promo.id}
              sx={{
                backgroundColor: "#FFF7EF",
                borderRadius: "20px",
                padding: { xs: "20px", md: "24px" },
                minHeight: { xs: "220px", md: "260px" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "26px", md: "34px" },
                    fontWeight: 700,
                    lineHeight: 1.15,
                    mb: 1.5,
                    color: "#111",
                    wordBreak: "break-word",
                  }}
                >
                  {promo.title}
                </Typography>

                {promo.description && (
                  <Typography
                    sx={{
                      fontSize: { xs: "15px", md: "17px" },
                      lineHeight: 1.5,
                      color: "#444",
                      mb: 2,
                      wordBreak: "break-word",
                    }}
                  >
                    {promo.description}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "grid", gap: 1 }}>
                {promo.categoryName && (
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>
                    <b>Категория:</b> {promo.categoryName}
                  </Typography>
                )}

                {promo.promoCode && (
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>
                    <b>Промокод:</b> {promo.promoCode}
                  </Typography>
                )}

                {promo.discountType && (
                  <Typography sx={{ fontSize: "14px", color: "#666" }}>
                    <b>Тип скидки:</b> {promo.discountType}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PromotionsSection;