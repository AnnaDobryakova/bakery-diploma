import { Box, Typography, Button } from '@mui/material';
import { useState, useMemo } from 'react';
import ModalWrapper from '../../modals/ModalWrapper';

const ProductModal = ({  product, open, onClose, addToCart }) => {
    const [active, setActive] = useState('price');
    const [mode, setMode] = useState('per100');

    const nutrients = useMemo(() => {
        if (!product) return null;

        if (mode === 'per100'){
            return {
                calories: product.nutrition.calories,
                proteins: product.nutrition.proteins,
                fats: product.nutrition.fats,
                carbs: product.nutrition.carbs
            };
        }

        const k = product.weight / 100;
        return {
            calories: Math.round(product.nutrition.calories * k),
            proteins: + (product.nutrition.proteins * k).toFixed(1),
            fats: + (product.nutrition.fats * k).toFixed(1),
            carbs: + (product.nutrition.carbs * k).toFixed(1),
        };
    }, [mode, product]);

    
    if (!product || !nutrients) return null;
    return (
            <ModalWrapper open={open} onClose={onClose} padding={'50px'}>
                <Box sx={{objectFit: 'none'}}>
                    <img src={product.imageURL} alt={product.name} style={{ width: '300px', height: '300px', objectFit: 'cover' }}    />
                </Box>

                <Box sx={{
                    width: '100%',
                }}>
                    <Typography id="product-title" variant="h4" sx={{fontWeight: '600'}}>
                        {product.name}
                    </Typography>
                    <Typography variant='h5' sx={{ mt: 2, fontWeight: '600' }}>
                        Состав:
                    </Typography>
                    <Typography id="product-description" variant='h6' sx={{ mt: 2 }}>
                        {product.description}
                    </Typography>
                    <Typography variant='h5' sx={{ mt: 2, fontWeight: '600' }}>
                        Пищевая ценность
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                      }}>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2,  flexDirection: 'row'}}>
                            <Button
                                variant='contained'
                                onClick={() => {setActive('price'); setMode('per100'); }}
                            sx={{
                                backgroundColor: active === 'price' ? '#FD8719' : '#FFD8B3',
                                color: active === 'price' ? '#ffffff' : '#9A9A9A',
                                borderRadius: '64px',
                                textTransform: 'initial',
                                
                            }}>100 г</Button>
                            <Button
                                variant='contained'
                                onClick={() => {setActive('all');setMode('total'); }}
                            sx={{
                                backgroundColor: active === 'all' ? '#FD8719' : '#FFD8B3',
                                color: active === 'all' ? '#ffffff' : '#9A9A9A',
                                borderRadius: '64px',
                                textTransform: 'initial',
                            }}>Весь продукт ({product.weight} гр)
                            </Button>
                        </Box>

                            <Box>
                                <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                mt: 2
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <Typography id="product-weight" variant='h6'>
                                        {nutrients.calories}
                                    </Typography>
                                    <Typography id="product-weight">
                                        ккал
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <Typography id="product-weight" variant='h6'>
                                        {nutrients.proteins}
                                    </Typography>
                                    <Typography id="product-weight" >
                                        белки
                                    </Typography>
                                </Box>
                                
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <Typography id="product-weight" variant='h6'>
                                        {nutrients.carbs}
                                    </Typography>
                                    <Typography id="product-weight">
                                        углеводы
                                    </Typography>
                                </Box>
                                
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                    <Typography id="product-weight" variant='h6'>
                                        {nutrients.fats}
                                    </Typography>
                                    <Typography id="product-weight">
                                        жиры
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ mt: 2 }} variant='h4'>
                            Итого:
                        </Typography>
                        <Typography id="product-price" sx={{ mt: 2 }} variant='h4'>
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
                            mt: 2,
                        }}
                        >
                        {product.remainder <= 0 ? "Нет в наличии" : "Добавить в корзину"}
                    </Button>
                </Box>
            </ModalWrapper>
    );
};

export default ProductModal;

