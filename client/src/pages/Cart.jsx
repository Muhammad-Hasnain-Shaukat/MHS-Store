import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Your cart</h1>
        <p className="status-text">
          Your cart is empty. <Link to="/">Browse the catalog →</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-row" key={item.product}>
              <img src={item.image} alt={item.name} />
              <div className="cart-row-info">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)} each</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product, Math.max(1, Number(e.target.value)))}
              />
              <p className="cart-row-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
              <button className="link-btn" onClick={() => removeItem(item.product)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button className="primary-btn full-width" onClick={handleCheckout}>
            {user ? "Proceed to checkout" : "Log in to checkout"}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
