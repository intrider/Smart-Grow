import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    updateCartCount();

    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("user");
    setCartCount(0);
    navigate("/");
  };
  return (
    <nav id="navbar-home">
      <ul>
        <li><Link to="/home" className="smart-logo">Smart-Grow</Link></li>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/store">Store</Link></li>
        <li><Link to ="/orders">Orders</Link></li>
        <li>
          <button className="cart-btn" onClick={() => navigate("/cart")}>
            🛒 Cart {cartCount > 0 && <span className="cart-count">({cartCount})</span>}
          </button>
        </li>

        <li>
          <Link to="/profileCompletion" className="profile">
            <i className="fas fa-user"></i> Profile
          </Link>
        </li>
        <li>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
