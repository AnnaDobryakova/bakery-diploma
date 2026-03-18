const API_URL = "http://localhost:5000/api/clients";

export const getClients = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Не удалось получить клиентов: ${response.status}`);
  }

  return await response.json();
};