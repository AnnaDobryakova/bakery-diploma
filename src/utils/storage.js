const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const ORDERS_KEY = "orders";
const PRODUCTS_KEY = "products";

// ==================== USERS ====================

export const getUsersFromStorage = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Ошибка при чтении users из localStorage:", error);
    return [];
  }
};

export const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Ошибка при сохранении users в localStorage:", error);
  }
};

export const getCurrentUserFromStorage = () => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Ошибка при чтении currentUser из localStorage:", error);
    return null;
  }
};

export const saveCurrentUserToStorage = (user) => {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Ошибка при сохранении currentUser в localStorage:", error);
  }
};

export const removeCurrentUserFromStorage = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error("Ошибка при удалении currentUser из localStorage:", error);
  }
};

// ==================== ORDERS ====================

export const getOrdersFromStorage = () => {
  try {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Ошибка при чтении orders из localStorage:", error);
    return [];
  }
};

export const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Ошибка при сохранении orders в localStorage:", error);
  }
};

export const addOrderToStorage = (order) => {
  try {
    const orders = getOrdersFromStorage();

    const maxId =
      orders.length > 0
        ? Math.max(...orders.map((o) => Number(o.id)))
        : 1000;

    const newOrder = {
      ...order,
      id: maxId + 1, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: order.status || "new",
    };

    const updatedOrders = [newOrder, ...orders];

    saveOrdersToStorage(updatedOrders);

    return newOrder;
  } catch (error) {
    console.error("Ошибка при добавлении заказа:", error);
    return null;
  }
};

export const updateOrderStatusInStorage = (orderId, newStatus) => {
  try {
    const orders = getOrdersFromStorage();

    const updatedOrders = orders.map((order) =>
      String(order.id) === String(orderId)
        ? {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : order
    );

    saveOrdersToStorage(updatedOrders);

    return updatedOrders.find((order) => String(order.id) === String(orderId)) || null;
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    return null;
  }
};

export const getOrderByIdFromStorage = (orderId) => {
  try {
    const orders = getOrdersFromStorage();
    return orders.find((order) => String(order.id) === String(orderId)) || null;
  } catch (error) {
    console.error("Ошибка при получении заказа по id:", error);
    return null;
  }
};

export const getOrdersByUserFromStorage = (userEmail) => {
  try {
    const orders = getOrdersFromStorage();
    return orders.filter((order) => order.userEmail === userEmail);
  } catch (error) {
    console.error("Ошибка при получении заказов пользователя:", error);
    return [];
  }
};

export const removeOrderFromStorage = (orderId) => {
  try {
    const orders = getOrdersFromStorage();
    const updatedOrders = orders.filter((order) => String(order.id) !== String(orderId));
    saveOrdersToStorage(updatedOrders);
  } catch (error) {
    console.error("Ошибка при удалении заказа:", error);
  }
};

// ==================== PRODUCTS ====================

export const getProductsFromStorage = () => {
  try {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error("Ошибка при чтении products из localStorage:", error);
    return [];
  }
};

export const saveProductsToStorage = (products) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Ошибка при сохранении products в localStorage:", error);
  }
};

export const updateProductInStorage = (productId, updatedFields) => {
  try {
    const products = getProductsFromStorage();

    const updatedProducts = products.map((product) =>
      String(product.id) === String(productId)
        ? { ...product, ...updatedFields }
        : product
    );

    saveProductsToStorage(updatedProducts);

    return updatedProducts.find((product) => String(product.id) === String(productId)) || null;
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    return null;
  }
};

// ==================== HELPERS ====================

export const clearOrdersFromStorage = () => {
  try {
    localStorage.removeItem(ORDERS_KEY);
  } catch (error) {
    console.error("Ошибка при очистке orders:", error);
  }
};

export const clearProductsFromStorage = () => {
  try {
    localStorage.removeItem(PRODUCTS_KEY);
  } catch (error) {
    console.error("Ошибка при очистке products:", error);
  }
};