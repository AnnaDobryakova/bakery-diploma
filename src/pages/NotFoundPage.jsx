import { Box, Button, Typography } from "@mui/material"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"

const NotFoundPage = () => {
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
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '25px'}}>
                    <Typography variant="h1" sx={{fontWeight: 600}}>404</Typography>
                    <Typography variant="h4">Упс... Страница не найдена</Typography>
                    <Typography variant="h6">Но Вы всегда можете перейти на главную!</Typography>
                    <Button className="button" variant="contained" href="/" sx={{color: 'white', backgroundColor: '#FD8719', borderRadius: '999px', width: '100%', fontSize: '16px'}}>Вернуться на главную страницу</Button>
                </Box>
            </Box>
        <Footer />
        </>
        
    )
}

export default NotFoundPage