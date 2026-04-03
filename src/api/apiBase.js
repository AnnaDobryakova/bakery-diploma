export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;