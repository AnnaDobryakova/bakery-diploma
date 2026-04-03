import { buildApiUrl } from "./apiBase";

const ORDERS_URL = buildApiUrl("/api/orders");

export const createOrder = async (orderData) => {
  const response = await fetch(ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Ошибка оформления заказа");
  }

  return response.json();
};

export const getAllOrders = async () => {
  const response = await fetch(ORDERS_URL);

  if (!response.ok) {
    throw new Error("Не удалось получить заказы");
  }

  return response.json();
};

export const getOrdersByEmail = async (email) => {
  const response = await fetch(
    `${ORDERS_URL}/by-email?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error("Не удалось получить заказы пользователя");
  }

  return response.json();
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`${ORDERS_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Не удалось обновить статус заказа");
  }

  return response.json();
};