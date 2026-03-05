import { useState } from "react";
import logo from "/img/logo.svg";
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import OrderModal from "./OrderModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = () => setIsMenuOpen(false);

  const [openCheckout, setOpenCheckout] = useState(false);

  const [productModalOpen, setProductModalOpen] = useState(false);

  const handleOpenCheckout = () => {
    setOpenCheckout(true);
  };

  const handleCloseCheckout = () => {
    setOpenCheckout(false);
  };

  return (
    <>
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <div className="header_left">
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

            {/* Бургер */}
            <button
              type="button"
              className={isMenuOpen ? "burger open" : "burger"}
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
          <div className={isMenuOpen ? "mobile_menu open" : "mobile_menu"}>
            <ul>
              <li>
                <a href="/" onClick={handleNavClick}>Главная</a>
              </li>
              <li>
                <a href="#about" onClick={handleNavClick}>О нас</a>
              </li>
              <li>
                <a href="/menu" onClick={handleNavClick}>Меню</a>
              </li>
              <li>
                <a href="#reviews" onClick={handleNavClick}>Отзывы</a>
              </li>
              <li>
                <a href="#promo" onClick={handleNavClick}>Акции</a>
              </li>
            </ul>
          </div>

          {/* Десктоп навигация */}
          <nav className="header_nav">
            <ul>
              <li><a href="/">Главная</a></li>
              <li><a href="#about">О нас</a></li>
              <li><a href="/menu">Меню</a></li>
              <li><a href="#reviews">Отзывы</a></li>
              <li><a href="#promo">Акции</a></li>
            </ul>
          </nav>

          <div className="header_ender">
            <button className="btn" type="button" aria-label="Профиль">
              <PersonIcon sx={{ 
                fontSize: 30, 
                cursor: 'pointer', 
                color: 'white',
                '&.MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-leclfh-MuiSvgIcon-root:hover': {
                  backgroundColor: '#FD8719'
                }
              }} />
            </button>

            <button className="btn" type="button" aria-label="Корзина" >
              <ShoppingCartIcon sx={{ fontSize: 30, cursor: 'pointer', color: 'white' }} />
            </button>

            <button className="button" type="button" onClick={handleOpenCheckout}>
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </header>
    <OrderModal open={openCheckout} onClose={handleCloseCheckout} />
    </>
    
  );
};

export default Header;
