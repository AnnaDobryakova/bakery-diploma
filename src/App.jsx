import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import HomePage from "./pages/HomePage";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminEmployees from "./admin/pages/employees/AdminEmployees";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminPromotions from "./admin/pages/promotions/AdminPromotions";
import AdminReports from "./admin/pages/AdminReports";
import AdminEmployeeForm from "./admin/pages/employees/AdminEmployeeForm";
import NotFoundPage from "./pages/NotFoundPage";
import MenuPage from "./pages/MenuPage";
import AccountPage from "./pages/AccountPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminRoute from "./admin/utils/AdminRoute";

export default function App() {
    const [cartItems, setCartItems] = useState(() => {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    });

    const clearCart = () => {
      setCartItems([]);
    };

    useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
      if (!product || Number(product.remainder) <= 0) return;

      setCartItems((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantity >= product.remainder) {
            return prevCart;
          }

          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prevCart, { ...product, quantity: 1 }];
      });
    };

      const removeFromCart = (productId) => {
        setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));
        };

          const changeQuantity = (productId, delta) => {
            setCartItems((prevCart) =>
              prevCart
                .map((item) =>
                  item.id === productId
                    ? { ...item, quantity: item.quantity + delta }
                    : item
                )
                .filter((item) => item.quantity > 0)
            );
          };

  return (
    <>
    <ScrollToHash />
    <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              changeQuantity={changeQuantity}
              clearCart={clearCart}
            />
          }
        />
      <Route path="/menu" element={
        <MenuPage 
          cartItems={cartItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          changeQuantity={changeQuantity}
          clearCart={clearCart}
        />
      } />
      <Route
        path="/menu/:id"
        element={
          <MenuPage
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            changeQuantity={changeQuantity}
          />
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              changeQuantity={changeQuantity}
              clearCart={clearCart}
            />
          </ProtectedRoute>
        }
      />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="*" element={<NotFoundPage />} />

      <Route path="/admin" element={<AdminRoute>
                                      <AdminLayout />
                                    </AdminRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="employees" element={<AdminEmployees />} />
        <Route path="employees/new" element={<AdminEmployeeForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="promotions" element={<AdminPromotions />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </Routes>
    </>
  );
}
