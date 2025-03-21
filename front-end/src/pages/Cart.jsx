import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

// useEffect(() => {
//     const userToken = localStorage.getItem("token");
//     if (!userToken) {
//       localStorage.removeItem("cart");  // ✅ Clear cart if user is not logged in
//       setCart({});
//     }
//   }, []);
  

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || {});

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[productId];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const totalAmount = Object.values(cart).reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {Object.keys(cart).length > 0 ? (
        <>
          <div className="cart-grid">
            {Object.values(cart).map((product) => (
              <div key={product._id} className="cart-item">
                <img src={`http://localhost:3008/${product.image}`} alt={product.name} className="cart-image" />
                <div className="cart-details">
                  <h3>{product.name}</h3>
                  <p>Price: ₹{product.price}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Total: ₹{product.totalPrice}</p>
                  <button onClick={() => removeFromCart(product._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <h3>Total Amount: ₹{totalAmount}</h3>
          <button className="checkout-btn" onClick={() => navigate("/payment")}>
            Proceed to Payment
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
