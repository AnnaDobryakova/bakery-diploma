import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from "../components/Product/ProductCard";
import ProductModal from "../components/Product/ProductModal";
import CheckoutModal from "../modals/CheckoutModal";
import { useState } from "react";
import { mockDataProducts } from "../data/mockData";
import "../styles/main.css";
import "../styles/components.css";
import "../styles/menu_components.css";

const MenuPage = ({ cartItems, addToCart, removeFromCart, changeQuantity }) => {

    const [productModalOpen, setProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setProductModalOpen(true);
    };

    const handleCloseModal = () => {
        setProductModalOpen(false);
        setSelectedProduct(null);
    };

    const handleOpenCheckout = () => {
        setCheckoutOpen(true);
    };

    const handleCloseCheckout = () => {
        setCheckoutOpen(false);
    };

    
    return (
        <div>
        <Header onCartClick={handleOpenCheckout} cartItems={cartItems}/>
        
        <main> 
            <section className="menu">
                <h1>Меню</h1>
                <div className="menu_right-line">
                    <div className="menu-filters">
                        <button className="filter active">Все</button>
                        <button className="filter">Хлеб</button>
                        <button className="filter">Соленая выпечка</button>
                        <button className="filter">Сладкая выпечка</button>
                        <button className="filter">Напитки</button>
                    </div>
                    <button className="filter menu_search">
                        <p>Найти</p>
                        <SearchIcon />
                    </button>
                </div>
                <div className="container">
                    <div className="menu-cards" >
                        { mockDataProducts.map((product)  => (
                        <ProductCard onClick={() => handleProductClick(product)} key={product.id} product={product} addToCart={addToCart}/>
                        ))}
                    </div>
                </div>
            </section>
        </main>
        <Footer />
        <ProductModal open={productModalOpen} onClose={handleCloseModal} product={selectedProduct} />
        <CheckoutModal
            open={checkoutOpen}
            onClose={handleCloseCheckout}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            changeQuantity={changeQuantity}
        />
        </div>
    )
}

export default MenuPage;

