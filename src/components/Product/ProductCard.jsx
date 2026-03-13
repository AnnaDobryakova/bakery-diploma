import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ProductCard = ({
  product,
  onClick,
  addToCart,
  changeQuantity,
  cartItems = [],
}) => {
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = Number(product.remainder) <= 0;

  return (
    <div
      className="menu_card"
      onClick={() => {
        if (!isOutOfStock) {
          onClick();
        }
      }}
      style={{
        opacity: isOutOfStock ? 0.55 : 1,
        filter: isOutOfStock ? "grayscale(100%)" : "none",
        position: "relative",
        cursor: isOutOfStock ? "not-allowed" : "pointer",
      }}
    >
      {isOutOfStock && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "#999",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "16px",
            fontWeight: 600,
            zIndex: 2,
          }}
        >
          Нет в наличии
        </div>
      )}

      <img src={product.imageURL} alt={product.name} />

      <div className="menu_block">
        <div className="menu_description">
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p style={{ marginTop: 8, fontWeight: 600 }}>
            Остаток: {product.remainder}
          </p>
        </div>

        <div className="menu_price">
          <h5>
            {product.price}₽<span className="menu_span">/ 1 шт.</span>
          </h5>

          <div className="menu_count">
            <button
              className="menu_btn"
              type="button"
              disabled={isOutOfStock || quantity === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (quantity > 0) {
                  changeQuantity(product.id, -1);
                }
              }}
            >
              <RemoveIcon sx={{ fontSize: 20 }} />
            </button>

            <span className="menu_number">{quantity}</span>

            <button
              className="menu_btn"
              type="button"
              disabled={isOutOfStock || quantity >= product.remainder}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <AddIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;