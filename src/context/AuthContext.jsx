import { createContext, useContext, useEffect, useState } from "react";
import {
  getUsersFromStorage,
  saveUsersToStorage,
  getCurrentUserFromStorage,
  saveCurrentUserToStorage,
  removeCurrentUserFromStorage,
} from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = getCurrentUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const register = ({ name, email, password, phone }) => {
    const users = getUsersFromStorage();

    const existingUser = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return { success: false, message: "Пользователь с таким email уже существует" };
    }

    const role = email.toLowerCase() === "admin@bakery.ru" || email.toLowerCase() === "admin@bakery.com" ? "admin" : "user";

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      phone: phone || "",
      role,
    };

    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);

    setUser(newUser);
    saveCurrentUserToStorage(newUser);

    setUser(newUser);
    saveCurrentUserToStorage(newUser);

    return { success: true, user: newUser };
  };

  const login = ({ email, password }) => {
    const users = getUsersFromStorage();

    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
    );
    

    if (!foundUser) {
      return { success: false, message: "Неверный email или пароль" };
    }

    setUser(foundUser);
    saveCurrentUserToStorage(foundUser);

    return { success: true, user: foundUser };
  };

  const logout = () => {
    setUser(null);
    removeCurrentUserFromStorage();
  };

  const updateProfile = (updatedData) => {
    if (!user) return;

    const users = getUsersFromStorage();

    const updatedUser = { ...user, ...updatedData };

    const updatedUsers = users.map((item) =>
      item.id === user.id ? updatedUser : item
    );

    saveUsersToStorage(updatedUsers);
    saveCurrentUserToStorage(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);