const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export const getUsersFromStorage = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsersToStorage = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUserFromStorage = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const saveCurrentUserToStorage = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const removeCurrentUserFromStorage = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};