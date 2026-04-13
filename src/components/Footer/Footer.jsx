import logo from "/img/logo.svg";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Box } from "@mui/material";
import vk from "/icons/vk.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_info">
          <Link to="/" className="footer_logo" aria-label="На главную">
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
          </Link>

          <div className="footer_phone">+7 (925) 383-60-65</div>
          <div className="footer_address">Россия, г. Москва, Корабельная ул., 17, корп. 1</div>

          <div className="footer_socials">
            <a href="#" className="footer_social_link" aria-label="Telegram">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  padding: "10px",
                  width: "50px",
                  height: "50px",
                  border: "2px solid #fff",
                }}
              >
                <TelegramIcon sx={{ fontSize: 30, color: "#fff" }} />
              </Box>
            </a>

            <a href="#" className="footer_social_link" aria-label="VK">
              <Box
                sx={{
                  overflow: "visible",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  padding: "8px",
                  width: "50px",
                  height: "50px",
                  border: "2px solid #fff",
                }}
              >
                <img
                  src={vk}
                  alt="vk"
                  style={{
                    width: "30px",
                    height: "30px",
                    filter: "invert(1)",
                    borderRadius: 0,
                  }}
                />
              </Box>
            </a>
          </div>

          <div className="footer_copyright">
            © Все права защищены.{" "}
            <Link to="/privacy" style={{ color: "#BABABA", textDecoration: "underline" }}>
              Политика конфиденциальности
            </Link>
          </div>
        </div>

        <div className="footer_nav">
          <div className="footer_customers">
            <h5 className="footer_title">Покупателям</h5>
            <ul className="footer_ul">
              <li className="footer_li"><Link to="/">Главная</Link></li>
              <li className="footer_li"><a href="/#about">О нас</a></li>
              <li className="footer_li"><a href="/menu">Меню</a></li>
              <li className="footer_li"><a href="/#reviews">Отзывы</a></li>
              <li className="footer_li"><a href="/#promo">Акции</a></li>
            </ul>
          </div>

          <div className="footer_categories">
            <h5 className="footer_title">Категории</h5>
            <div className="footer_ul">
              <Link to="/menu?category=Хлеб" className="footer_li">
                Хлеб
              </Link>

              <Link to="/menu?category=Соленая выпечка" className="footer_li">
                Соленая выпечка
              </Link>

              <Link to="/menu?category=Сладкая выпечка" className="footer_li">
                Сладкая выпечка
              </Link>

              <Link to="/menu?category=Напитки" className="footer_li">
                Напитки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;