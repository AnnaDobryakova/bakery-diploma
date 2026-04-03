import { Box, Typography } from "@mui/material"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"

const PrivacyPolicy = () => {
    return (
        <>
        <Header />  
        <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: '50px',
                outline: 'none',
                gap: '25px',}}>
                <Box p="40px" maxWidth="1200px" margin="0 auto">
                    <Typography variant="h2" mb={3}>
                        Политика конфиденциальности
                    </Typography>

                    <Typography sx={{fontSize: '20px'}} mb={2}>
                        Настоящая политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей веб-приложения пекарни.
                    </Typography>

                    <Typography sx={{fontSize: '20px'}} mb={2}>
                        При использовании системы пользователь предоставляет следующие данные:
                    </Typography>

                    <ul style={{fontSize: '20px', marginLeft: '20px'}}>
                        <li>имя;</li>
                        <li>номер телефона;</li>
                        <li>адрес электронной почты.</li>
                    </ul>

                    <Typography sx={{fontSize: '20px'}} mt={2} mb={2}>
                        Данные используются исключительно для:
                    </Typography>

                    <ul style={{fontSize: '20px', marginLeft: '20px'}}>
                        <li>оформления и обработки заказов;</li>
                        <li>обратной связи с клиентом;</li>
                        <li>уведомления о статусе заказа.</li>
                    </ul>

                    <Typography sx={{fontSize: '20px'}} mt={2} mb={2}>
                        Система не передает персональные данные третьим лицам и обеспечивает их защиту в рамках используемых технологий.
                    </Typography>

                    <Typography sx={{fontSize: '20px'}}>
                        Пользователь, используя систему, выражает согласие на обработку своих персональных данных.
                    </Typography>
                </Box>
            </Box>
        <Footer />
        </>
        
    )
}

export default PrivacyPolicy