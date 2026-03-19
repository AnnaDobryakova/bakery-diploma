const API_URL = "http://localhost:5000/api/categories";

export const getCategories = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Не удалось получить категории");
  }

  return response.json();
};

export const getCategoryById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Не удалось получить категорию");
  }

  return response.json();
};

export const createCategory = async (categoryData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось создать категорию");
  }

  return response.json();
};

export const updateCategory = async (id, categoryData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось обновить категорию");
  }

  return response.json();
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось удалить категорию");
  }

  return response.json();
};