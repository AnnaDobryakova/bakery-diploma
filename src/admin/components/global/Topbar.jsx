import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const navigate = useNavigate();
  

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      console.log("orders response:", res.data);

      const orders = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.orders)
        ? res.data.orders
        : [];

      console.log("statuses:", orders.map((order) => order.status));

      const newOrders = orders.filter((order) => order.status === "new");
      setNewOrdersCount(newOrders.length);
      
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
      setNewOrdersCount(0);
    }
  };

  fetchOrders();

  const interval = setInterval(fetchOrders, 10000);
  return () => clearInterval(interval);
}, []);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon sx={{ color: colors.primary[100] }} />
        </IconButton>
      </Box>

      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon sx={{ color: colors.primary[100] }} />
          ) : (
            <LightModeOutlinedIcon sx={{ color: colors.primary[100] }} />
          )}
        </IconButton>

        <IconButton onClick={() => navigate("/admin/orders")}>
          <Badge badgeContent={newOrdersCount} color="error">
            <NotificationsOutlinedIcon sx={{ color: colors.primary[100] }} />
          </Badge>
        </IconButton>

        <IconButton>
          <SettingsOutlinedIcon sx={{ color: colors.primary[100] }} />
        </IconButton>

        <IconButton>
          <PersonOutlinedIcon sx={{ color: colors.primary[100] }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;