import { Box, Typography } from "@mui/material";

const PromotionsSection = ({ promotions = [] }) => {
  if (!promotions.length) return null;

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          mb: 5,
          fontWeight: 500,
        }}
      >
        Акции
      </Typography>

      <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
      }}    
      >
        {promotions.map((promotion) => (
          <Box
            key={promotion.id}
            sx={{
              width: "100%",
              maxWidth: 360,
            }}
          >
            <Box
              component="img"
              src={promotion.imageUrl || "/images/promotions/default.jpg"}
              alt={promotion.title}
              sx={{
                width: "100%",
                height: 320,
                objectFit: "cover",
                borderRadius: "16px",
                display: "block",
              }}
            />

            <Typography
              sx={{
                mt: 2,
                fontSize: "2rem",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {promotion.title}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: "1rem",
                color: "text.secondary",
                lineHeight: 1.4,
              }}
            >
              {promotion.restrictions || "Без дополнительных ограничений"}
            </Typography>
            {promotion.promoCode && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#FD8719",
                  lineHeight: 1.4,
                }}
              >
                Промокод: {promotion.promoCode}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PromotionsSection;