import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import StarIcon from '@mui/icons-material/Star';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import "../styles/main.css";
import "../styles/components.css";
import { useState } from "react";

const HomePage = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleNavClick = () => setIsMenuOpen(false)


  return (
    <div>
      <Header cartItems={cartItems}/>
      <section className="hero">
        <div className="hero_inner container">
            <div className="hero__content">
                <h1><em>Погрузитесь</em><br /> в мир уникальной свежести и аромата!</h1>
                <p>Для нас выпечка – это не просто еда, а настоящее искусство, созданное с душой. Приглашаем вас в
                    уютное гастрономическое путешествие, где каждый кусочек – это встреча с теплом, качеством и
                    безупречным вкусом.</p>
                <button className="button button_hero">Выбрать выпечку</button>
            </div>
        </div>
      </section>
      <main className="content" id="about">
        <section className="about">
            <img src="/img/about.png" alt="about"/>
            <div className="about_paragraph">
                <h2>О пекарне</h2>
                <p>
                    В пекарне «Тонэ» мы создаем ту самую атмосферу, где рождаются любимые традиции — будь то утро с
                    чашкой ароматного кофе и свежим круассаном или семейный ужин с нашим деревенским хлебом. Мы
                    тщательно готовим каждую булку, каждый бейгл и эклер, чтобы вы могли быть уверены в качестве и
                    вкусе.<br/>
                    <br/>
                    Наша философия проста: только лучшее заслуживает места на вашем столе. Именно поэтому мы используем
                    натуральные ингредиенты, соблюдаем традиционные рецепты и постоянно расширяем ассортимент — от
                    сытных хачапури и сочников до нежных десертов.<br/>
                    <br/>
                    А удобный заказ с самовывозом позволяет вам легко и быстро забрать любимую выпечку в любое удобное
                    время.<br/>
                </p>
            </div>
        </section>
        <section className="choice">
            <h2>Почему выбирают нас?</h2>
            <div className="choice_container">
                <div className="choice_card">
                    <img src="/icons/icon1.png" alt="icon1"/>
                    <h3 className="choice_title">Настоящий вкус</h3>
                    <p className="choice_subtitle">Мы используем только натуральные ингредиенты</p>
                </div>
                <div className="choice_card">
                    <img src="/icons/icon2.png" alt="icon2"/>
                    <h3 className="choice_title">Широкий выбор</h3>
                    <p className="choice_subtitle">В нашей пекарне каждый найдет что-то по душе</p>
                </div>
                <div className="choice_card">
                    <img src="/icons/icon3.png" alt="icon3"/>
                    <h3 className="choice_title">Всегда свежая выпечка</h3>
                    <p className="choice_subtitle">Ароматная и румяная выпечка, которую мы готовим несколько раз в день</p>
                </div>
                <div className="choice_card">
                    <img src="/icons/icon4.png" alt="icon4"/>
                    <h3 className="choice_title">Удобство и экономия времени</h3>
                    <p className="choice_subtitle">Забронируйте выпечку и заберите в удобное время</p>
                </div>
            </div>
        </section>
        <section className="gallery container" id="menu">
            <h2>Что мы печем</h2>
            <div className="gallery_container">
                <button className="gallery_arrow left">
                    <ArrowBackIosNewIcon sx={{ fontSize: 70 }} />
                </button>
                <div className="gallery_cards">
                    <div className="gallery_card" data-index="0">
                        <img src="/img/bun_1.png" alt="bun_1"/>
                        <h4 className="gallery_title">Булочка</h4>
                        <p className="gallery_subtitle">60 руб.</p>
                        <button className="button button_gallery" onClick={handleNavClick}>
                            <a href="/menu" style={{textDecoration: 'none', color: 'white'}}>Перейти в каталог</a>
                        </button>
                    </div>
                    <div className="gallery_card" data-index="1">
                        <img src="/img/bun_2.png" alt="bun_2"/> 
                        <h4 className="gallery_title">Булочка</h4>
                        <p className="gallery_subtitle">60 руб.</p>
                        <button className="button button_gallery" onClick={handleNavClick}>
                            <a href="/menu" style={{textDecoration: 'none', color: 'white'}}>Перейти в каталог</a>
                        </button>
                    </div>
                    <div className="gallery_card" data-index="2">
                        <img src="/img/bun_3.png" alt="bun_3"/>
                        <h4 className="gallery_title">Булочка</h4>
                        <p className="gallery_subtitle">60 руб.</p>
                        <button className="button button_gallery" onClick={handleNavClick}>
                            <a href="/menu" style={{textDecoration: 'none', color: 'white'}}>Перейти в каталог</a>
                        </button>
                    </div>
                </div>
                <button className="gallery_arrow right">
                    <ArrowBackIosNewIcon sx={{ fontSize: 70, transform: 'rotate(180deg)' }} />
                </button>
            </div>
        </section>
        <section className="promo" id="promo">
            <h2 className="promo_title">Акции</h2>
            <div className="promo_container">
                <div className="promo__grid">
                    <div className="promo__item">
                        <img src="/img/stocks.png" alt="Акция 20%" />
                        <p>Каждый день скидка 20% с 19:00 до 21:00</p>
                    </div>
                    <div className="promo__item">
                        <img src="/img/stocks.png" alt="Акция 20%" />
                        <p>Каждый день скидка 20% с 19:00 до 21:00</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="reviews" id="reviews">
            <h2 className="review_title">Отзывы наших клиентов</h2>
            <div className="reviews__grid container">
                <div className="review">
                    <FormatQuoteIcon style={{ fontSize: 70}} />
                    <p className="review__text">
                        Очень вкусно. Люблю здесь брать пирожки с мясом. Пробовала гречишный хлеб и лимонную булочку,
                        все очень вкусно. Сюда хочется приходить еще
                    </p>
                    <div className="review__rating">
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                    </div>
                    <div className="review__person">
                        <img src="/img/ava1.png" alt="Евгений"/>
                        <span>Евгений</span>
                    </div>
                </div>

                <div className="review">
                    <FormatQuoteIcon style={{ fontSize: 70}}  />
                    <p className="review__text">
                        Вкусно пока все что я покупала. Но я попробовала еще не все! Творожный маффин, эклер,
                        сдоба – невероятно вкусно. Купила хлеб с томатом.
                    </p>
                    <div className="review__rating">
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                    </div>
                    <div className="review__person">
                        <img src="/img/ava2.png" alt="Лилия"/>
                        <span>Лилия</span>
                    </div>
                </div>

                <div className="review">
                    <FormatQuoteIcon style={{ fontSize: 70}}  />
                    <p className="review__text">
                        Сумасшедшие лепешки и вкуснейший деревенский хлеб, всегда холодный тархун Натаhtari,
                        булочки и прочая выпечка – рекомендую!
                    </p>
                    <div className="review__rating">
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                    </div>
                    <div className="review__person">
                        <img src="/img/ava3.png" alt="Дмитрий" />
                        <span>Дмитрий</span>
                    </div>
                </div>

            </div>
        </section>
    </main>
    <Footer />
    </div>
  );
}

export default HomePage;
