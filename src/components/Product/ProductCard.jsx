import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const ProductCard = ({ product, onClick, addToCart, changeQuantity, cartItems = [] }) => {
    const cartItem = cartItems.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
        <div className="menu_card" onClick={onClick}>
            <img src={product.imageURL} alt={product.name} />
            <div className="menu_block">
                <div className="menu_description">
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                </div>
                <div className="menu_price">
                    <h5>{product.price}₽<span className="menu_span">/ 1 шт.</span></h5>
                    <div className="menu_count">
                        <button
                            className="menu_btn"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (quantity > 0) {
                                changeQuantity(product.id, -1);
                                }
                            }}
                        >
                            <RemoveIcon sx={{ fontSize: 20 }} />
                        </button>
                        <span className="menu_number">{quantity}</span>
                        <button 
                            className="menu_btn"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                            }}
                        >
                            <AddIcon sx={{ fontSize: 20 }} />
                        </button>
                    </div>
                    {/* <button
                        className="menu_cart"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                    >
                        <ShoppingBagIcon sx={{ color: 'white' }} />
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default ProductCard