import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ProductModal from "../components/ProductModal";
import { useState } from "react";
import { mockDataProducts } from "../admin/data/mockData";
import "../styles/main.css";
import "../styles/components.css";
import "../styles/menu_components.css";
// import "../styles/product_modal.css";

const MenuPage = () => {

    const [productModalOpen, setProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setProductModalOpen(true);
    };

    const handleCloseModal = () => {
        setProductModalOpen(false);
        setSelectedProduct(null);
    };

    
    return (
        <div>
        <Header />
        
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
                    <div className="menu-cards">
                        {mockDataProducts.map((product) => (
                        <div className="menu_card" onClick={() => handleProductClick(product)}>
                            <img src={product.imageURL} alt={product.name} />
                            <div className="menu_block">
                                <div className="menu_description">
                                    <h4>{product.name}</h4>
                                    <p>{product.description}</p>
                                </div>
                                <div className="menu_price">
                                    <h5>{product.price}₽<span className="menu_span">/ 1 шт.</span></h5>
                                    <button className="menu_count">
                                        <button className="menu_btn"><RemoveIcon sx={{ fontSize: 20 }} /></button>
                                        <span className="menu_number">0</span>
                                        <button className="menu_btn"><AddIcon sx={{ fontSize: 20 }} /></button>
                                    </button>
                                    <button className="menu_cart">
                                        <ShoppingBagIcon sx={{ color: 'white' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
        <Footer />
        <ProductModal open={productModalOpen} handleClose={handleCloseModal} product={selectedProduct} />
        </div>
    )
}

export default MenuPage;

