import { Box, Typography } from "@mui/material";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          padding: {
            xs: "150px 16px 40px",
            sm: "160px 20px 50px",
            md: "190px 20px 60px",
          },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            maxWidth: "900px",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "30px",
                sm: "38px",
                md: "48px",
              },
              fontWeight: 600,
              lineHeight: 1.15,
              mb: 3,
              wordBreak: "break-word",
            }}
          >
            Политика конфиденциальности
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "15px",
                sm: "17px",
                md: "20px",
              },
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Настоящая политика конфиденциальности определяет порядок обработки и защиты
            персональных данных пользователей веб-приложения пекарни.
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "15px",
                sm: "17px",
                md: "20px",
              },
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            При использовании системы пользователь предоставляет следующие данные:
          </Typography>

          <Box
            component="ul"
            sx={{
              pl: 3,
              mb: 2,
              "& li": {
                fontSize: {
                  xs: "15px",
                  sm: "17px",
                  md: "20px",
                },
                lineHeight: 1.6,
                mb: 0.5,
                wordBreak: "break-word",
              },
            }}
          >
            <li>имя;</li>
            <li>номер телефона;</li>
            <li>адрес электронной почты.</li>
          </Box>

          <Typography
            sx={{
              fontSize: {
                xs: "15px",
                sm: "17px",
                md: "20px",
              },
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Данные используются исключительно для:
          </Typography>

          <Box
            component="ul"
            sx={{
              pl: 3,
              mb: 2,
              "& li": {
                fontSize: {
                  xs: "15px",
                  sm: "17px",
                  md: "20px",
                },
                lineHeight: 1.6,
                mb: 0.5,
                wordBreak: "break-word",
              },
            }}
          >
            <li>оформления и обработки заказов;</li>
            <li>обратной связи с клиентом;</li>
            <li>уведомления о статусе заказа.</li>
          </Box>

          <Typography
            sx={{
              fontSize: {
                xs: "15px",
                sm: "17px",
                md: "20px",
              },
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            Система не передает персональные данные третьим лицам и обеспечивает их защиту
            в рамках используемых технологий.
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "15px",
                sm: "17px",
                md: "20px",
              },
              lineHeight: 1.6,
            }}
          >
            Пользователь, используя систему, выражает согласие на обработку своих
            персональных данных.
          </Typography>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;