import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CategoryMenu from "./CategoryMenu";
import api from "../api/axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">MHS</span>
          <span className="brand-word">Store</span>
        </Link>

        <CategoryMenu categories={categories} />

        <nav className="nav-links">
          <Link to="/">All products</Link>
          {user && <Link to="/orders">My Orders</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link">
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
          {user ? (
            <div className="user-chip">
              <span>{user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="link-btn">
                Log out
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
