import { Box, IconButton, useTheme } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useAdminSearch } from "../../../context/AdminSearchContext";
import { useLocation } from "react-router-dom";

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const isProfileMenuOpen = Boolean(anchorEl);

    const { user, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { search, setSearch } = useAdminSearch();
    const location = useLocation();

    const hideSearchRoutes = ["/admin/dashboard", "/admin/reports"];
    const shouldShowSearch = !hideSearchRoutes.includes(location.pathname);

    const handleProfileClick = (event) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

      setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
  setAnchorEl(null);
};

const handleAccountClick = () => {
  handleProfileMenuClose();

  if (user?.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/account");
  }
};

const handleLogoutClick = () => {
  handleProfileMenuClose();
  logout();
  navigate("/");
};

  

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
      {
        shouldShowSearch && (
          <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder='Поиск' value={search} onChange={(e) => setSearch(e.target.value)} />
            <IconButton type="button" sx={{ p: 1 }} >
              <SearchIcon sx={{ color: colors.primary[100] }} />
            </IconButton>
          </Box>
        )
      }
      

      <Box display="flex" alignItems="center" ml="auto">
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

        <IconButton onClick={handleProfileClick}>
          <PersonOutlinedIcon sx={{ color: colors.primary[100] }} />
        </IconButton>

        
        <Menu 
            anchorEl={anchorEl}
            open={isProfileMenuOpen}
            onClose={handleProfileMenuClose}
            disableScrollLock
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              sx: {
                mt: 1,
                borderRadius: "16px",
                minWidth: 220,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: "8px",
                "& .MuiMenuItem-root": {
                  padding: "8px 16px",
                  borderRadius: "12px",
                  "&:hover": {
                    backgroundColor: colors.blueAccent[100],
                    color: colors.blueAccent[500],
                  },
                },
              },
            }}
            PaperProps={{
              sx: {
                backgroundColor: colors.primary[500],
              },
            }}
          >
            <MenuItem onClick={handleAccountClick}
            sx={{
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: colors.blueAccent[500],
                color: colors.blueAccent[100],
              },
            }}>
              {user?.role === "admin" ? "Админ-панель" : "Личный кабинет"}
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>Выйти</MenuItem>
            
          </Menu>
        </Box>
      </Box>
  );
};

export default Topbar;