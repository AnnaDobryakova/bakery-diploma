import { Modal, Box, Typography, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function OrderModal({ open, onClose }) {
  return (
        <>
            <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="order-title"
            aria-describedby="order-description"
            >
            <Box sx={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700,
                bgcolor: 'background.paper',
                borderRadius: '48px',
                boxShadow: 24,
                
                outline: 'none',
                gap: '25px',
             }}>
                <Box sx={{width: '50%',
                    backgroundColor: '#FFF7EF',
                    padding: '50px',
                    borderTopLeftRadius: '48px',
                    borderBottomLeftRadius: '48px',

                    }}>
                    
                
                <Box sx={{
                    
                }}>
                    <Typography variant='h5' sx={{ mt: 2, fontWeight: '600' }}>
                        Корзина
                    </Typography>
                    <hr></hr>
                    <Box sx={{ display: 'flex', mb: 2,  flexDirection: 'row', mt: 2, gap: '10px', alignItems: 'center'}}>
                        <Box>
                            <img src='/img/logo.svg'/>
                        </Box>
                        
                        <Box sx={{ display: 'flex',  flexDirection: 'column', justifyContent: 'space-around'}}>
                            <Typography id="product-title" variant="h6" sx={{fontWeight: '600'}}>
                                Булочка
                            </Typography>
                            <Typography id="product-price" variant="h6" sx={{}}>
                                60 p
                            </Typography>
                        </Box>
                        <Box>
                            <button className="menu_count">
                                <button className="menu_btn"><RemoveIcon sx={{ fontSize: 20 }} /></button>
                                <span className="menu_number">0</span>
                                <button className="menu_btn"><AddIcon sx={{ fontSize: 20 }} /></button>
                            </button>
                        </Box>
                          
                    </Box>
                    

                    </Box>
                    
                    <hr></hr>
                    <Button 
                    variant='contained' 
                            sx={{
                                backgroundColor: '#FD8719',
                                borderRadius: '64px',
                                textTransform: 'initial',
                                width: '100%',
                                mt: 2
                                
                            }}
                    >Добавить в корзину</Button>
                </Box>

            </Box>
            </Modal>
        </>
  );
}