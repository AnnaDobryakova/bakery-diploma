const API_URL = "http://localhost:5000/api/products";

const normalizeProduct = (product) => ({
  id: product.id,
  imageURL: product.imageUrl,
  name: product.name,
  description: product.description || "",
  category: product.category || "other",
  price: Number(product.price),
  remainder: product.quantity,
  updateDate: product.updatedAt,
  weight: product.weight ?? 100,
  nutrition: {
    calories: product.calories ?? 0,
    proteins: Number(product.proteins ?? 0),
    fats: Number(product.fats ?? 0),
    carbs: Number(product.carbohydrates ?? 0),
  },
  isAvailable: product.isAvailable,
});

export const getProducts = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Не удалось получить товары");
  }

  const data = await response.json();
  return data.map(normalizeProduct);
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Не удалось получить товар");
  }

  const data = await response.json();
  return normalizeProduct(data);
};

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось создать товар");
  }

  const data = await response.json();
  return normalizeProduct(data);
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось обновить товар");
  }

  const data = await response.json();
  return normalizeProduct(data);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось удалить товар");
  }

  return response.json();
};

export const updateProductStock = async (id, quantity) => {
  const response = await fetch(`${API_URL}/${id}/stock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error("Не удалось обновить остаток");
  }

  const updated = await response.json();
  return normalizeProduct(updated);
};

export const getProductCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Не удалось получить категории");
  }

  return response.json();
};