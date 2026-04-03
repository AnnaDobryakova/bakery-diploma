import { useState } from "react";
import logo from "/img/logo.svg";
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../../modals/AuthModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Header = ({ onCartClick, cartItems = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = () => setIsMenuOpen(false);

  // const [openCheckout, setOpenCheckout] = useState(false);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isProfileMenuOpen = Boolean(anchorEl);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <div className="header_left">
            <Link to="/" className="header_logo_link" aria-label="На главную">
              <button className="header_logo" type="button" aria-label="На главную">
              <svg
                width="78"
                height="78"
                viewBox="0 0 78 78"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <mask
                  id="mask0_286_46"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="78"
                  height="78"
                >
                  <rect width="78" height="78" rx="20" fill="#D9D9D9" />
                </mask>

                <g mask="url(#mask0_286_46)">
                  <rect
                    x="-2.10791"
                    y="-2.10791"
                    width="82.2162"
                    height="82.2162"
                    rx="20"
                    fill="url(#pattern0_286_46)"
                  />
                </g>

                <defs>
                  <pattern id="pattern0_286_46" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_286_46" transform="scale(0.00333333)" />
                  </pattern>
                  <image
                    id="image0_286_46"
                    width="300"
                    height="300"
                    preserveAspectRatio="none"
                    xlinkHref={logo}
                  />
                </defs>
              </svg>
            </button>
            </Link>
            

            {/* Бургер */}
            <button
              type="button"
              className={isMenuOpen ? "burger active" : "burger"}
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Открыть меню"
              aria-expanded={isMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Мобильное меню */}
          <div className={isMenuOpen ? "mobile_menu active" : "mobile_menu"}>
            <ul>
              <li>
                <Link to="/" onClick={handleNavClick}>Главная</Link>
              </li>
              <li>
                <Link to="/#about" onClick={handleNavClick}>О нас</Link>
              </li>
              <li>
                <Link to="/menu" onClick={handleNavClick}>Меню</Link>
              </li>
              <li>
                <Link to="/#promo" onClick={handleNavClick}>Акции</Link>
              </li>
              <li>
                <Link to="/#reviews" onClick={handleNavClick}>Отзывы</Link>
              </li>
            </ul>
          </div>

          {/* Десктоп навигация */}
          <nav className="header_nav">
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/#about">О нас</Link></li>
              <li><Link to="/menu">Меню</Link></li>
              <li><Link to="/#promo">Акции</Link></li>
              <li><Link to="/#reviews">Отзывы</Link></li>
            </ul>
          </nav>

          <div className="header_ender">
            <button className="btn" type="button" aria-label="Профиль" onClick={handleProfileClick}>
              <PersonIcon sx={{ 
                fontSize: 30, 
                cursor: 'pointer', 
                color: 'white',
                '&.MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-leclfh-MuiSvgIcon-root:hover': {
                  backgroundColor: '#FD8719'
                }
              }} />
            </button>

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
                },
              }}
            >
              <MenuItem onClick={handleAccountClick}
              sx={{
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#FFF4E8",
                  color: "#FD8719",
                },
              }}>
                {user?.role === "admin" ? "Админ-панель" : "Личный кабинет"}
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>Выйти</MenuItem>
            </Menu>

            <button className="btn" type="button" aria-label="Корзина" onClick={onCartClick}>
              <ShoppingCartIcon sx={{ fontSize: 30, cursor: 'pointer', color: 'white' }} />
              {totalCount > 0 && <span style={{color: 'white'}}>{totalCount}</span>}
            </button>

            <button className="button" type="button" onClick={onCartClick}>
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </header>
    <AuthModal
      open={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
    />
    </>
    
  );
};

export default Header;
