import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", address: "", city: "", postalCode: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/orders", {
        items,
        shippingAddress: form,
        totalPrice,
      });
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="page"><p className="status-text">Your cart is empty.</p></div>;
  }

  return (
    <div className="page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Shipping details</h2>
          {error && <p className="error-text">{error}</p>}
          <label>Full name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
          <label>Address</label>
          <input name="address" value={form.address} onChange={handleChange} required />
          <div className="form-row">
            <div>
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} required />
            </div>
            <div>
              <label>Postal code</label>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} required />
            </div>
          </div>
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} required />
          <button className="primary-btn full-width" type="submit" disabled={loading}>
            {loading ? "Placing order…" : `Place order — $${totalPrice.toFixed(2)}`}
          </button>
        </form>

        <aside className="cart-summary">
          <h2>Order items</h2>
          {items.map((i) => (
            <div className="summary-row" key={i.product}>
              <span>{i.name} × {i.quantity}</span>
              <span>${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
