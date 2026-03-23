import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ProductCard from "../components/Product/ProductCard";
import ProductModal from "../components/Product/ProductModal";
import CheckoutModal from "../modals/CheckoutModal";
import { useEffect, useState } from "react";
import { getProducts } from "../api/productsApi";
import { getCategories } from "../api/categoriesApi";
import "../styles/main.css";
import "../styles/components.css";
import "../styles/menu_components.css";

const MenuPage = ({
  cartItems,
  addToCart,
  removeFromCart,
  changeQuantity,
  clearCart,
}) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Ошибка загрузки данных меню:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Header onCartClick={handleOpenCheckout} cartItems={cartItems} />

      <main>
        <section className="menu">
          <h1>Меню</h1>
          <div className="menu_right-line">
            <div className="menu-filters">
              <button
                className={`filter ${category === "all" ? "active" : ""}`}
                onClick={() => setCategory("all")}
              >
                Все
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.value}
                  className={`filter ${category === cat.value ? "active" : ""}`}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <input
              className="filter menu_search"
              type="text"
              placeholder="Найти"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="container">
            <div className="menu-cards">
              {loading ? (
                <p>Загрузка товаров...</p>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                    addToCart={addToCart}
                    changeQuantity={changeQuantity}
                    cartItems={cartItems}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ProductModal
        open={productModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        addToCart={addToCart}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={handleCloseCheckout}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        changeQuantity={changeQuantity}
        clearCart={clearCart}
      />
    </div>
  );
};

export default MenuPage;