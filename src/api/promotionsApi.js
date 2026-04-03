import { buildApiUrl } from "./apiBase";

const API_URL = buildApiUrl("/api/promotions");

export const getPromotions = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Не удалось получить акции");
  }

  return response.json();
};

export const getPromotionById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Не удалось получить акцию");
  }

  return response.json();
};

export const createPromotion = async (promotionData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promotionData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось создать акцию");
  }

  return response.json();
};

export const updatePromotion = async (id, promotionData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promotionData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось обновить акцию");
  }

  return response.json();
};

export const deletePromotion = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Не удалось удалить акцию");
  }

  return response.json();
};