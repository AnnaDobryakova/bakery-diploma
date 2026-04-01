import { createContext, useContext, useState } from "react";

const AdminSearchContext = createContext(null);

export const AdminSearchProvider = ({ children }) => {
  const [search, setSearch] = useState("");

  return (
    <AdminSearchContext.Provider value={{ search, setSearch }}>
      {children}
    </AdminSearchContext.Provider>
  );
};

export const useAdminSearch = () => {
  const context = useContext(AdminSearchContext);
  if (!context) {
    throw new Error("useAdminSearch must be used inside AdminSearchProvider");
  }
  return context;
};