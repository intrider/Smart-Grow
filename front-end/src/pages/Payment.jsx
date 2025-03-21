import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Payment.module.css";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const userId = localStorage.getItem("userId");
  const distributorId = localStorage.getItem("selectedDistributor");

  const totalAmount = Object.values(cart).reduce((acc, item) => acc + item.totalPrice, 0);

  const placeOrder = async () => {
    if (!distributorId) {
      alert("No distributor selected. Please select a distributor.");
      return;
    }

    const orderData = {
      userId,
      distributorId,
      products: Object.values(cart).map(({ _id, quantity, price }) => ({
        productId: _id,
        quantity,
        price,
      })),
      totalAmount,
      paymentMethod,
      status: "Pending",
    };

    try {
      await axios.post("http://localhost:3008/order/place", orderData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      navigate("/home");
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error);
      alert("Order placement failed. " + (error.response?.data?.message || "Please try again."));
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <h2 className={styles.heading}>Choose Payment Method</h2>
      <label className={styles.paymentOption}>
        <input
          type="radio"
          name="payment"
          value="cash"
          checked={paymentMethod === "cash"}
          onChange={() => setPaymentMethod("cash")}
          className={styles.radioInput}
        />
        Pay on Delivery
      </label>
      <label className={styles.paymentOption}>
        <input
          type="radio"
          name="payment"
          value="upi"
          checked={paymentMethod === "upi"}
          onChange={() => setPaymentMethod("upi")}
          className={styles.radioInput}
        />
        Pay via UPI
      </label>
      <h3 className={styles.totalAmount}>Total Amount: ₹{totalAmount}</h3>
      <button className={styles.checkoutButton} onClick={placeOrder}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Payment;
