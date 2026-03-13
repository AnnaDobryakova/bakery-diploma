export const createOrder = async (orderData) => {
  const response = await fetch("http://localhost:5000/api/orders", {
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