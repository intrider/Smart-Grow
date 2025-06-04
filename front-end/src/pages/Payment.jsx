// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "./Payment.module.css";

// const Payment = () => {
//   const navigate = useNavigate();
//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [userId, setUserId] = useState(null);
//   const [distributorId, setDistributorId] = useState(null);
//   const [cart, setCart] = useState({});

//   useEffect(() => {
//     console.log("Stored userId:", localStorage.getItem("userId"));
//     console.log("Stored distributorId:", localStorage.getItem("selectedDistributor"));

//     const storedUserId = localStorage.getItem("userId");
//     const storedDistributorId = localStorage.getItem("selectedDistributor");
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || {};

//     if (!storedUserId || !storedDistributorId) {
//       console.error("Missing userId or distributorId:", { storedUserId, storedDistributorId });
//       alert("Session expired or invalid user. Please log in again.");
//       navigate("/login");
//       return;
//     }

//     setUserId(storedUserId);
//     setDistributorId(storedDistributorId);
//     setCart(storedCart);
//   }, [navigate]);

//   if (!userId || !distributorId) return null; // Prevents further rendering until values are set

//   const totalAmount = Object.values(cart).reduce((acc, item) => acc + (item.totalPrice || 0), 0);

//   const placeOrder = async () => {
//     if (Object.keys(cart).length === 0) {
//       alert("Your cart is empty. Please add products before checkout.");
//       return;
//     }

//     const orderData = {
//       userId: String(userId),
//       distributorId: String(distributorId),
//       products: Object.values(cart).map(({ _id, quantity, price }) => ({
//         productId: _id,
//         quantity,
//         price,
//       })),
//       totalAmount,
//       paymentMethod,
//       status: "Pending",
//     };

//     console.log("Sending order data:", orderData); // Debugging

//     try {
//       const response = await axios.post("http://localhost:3008/order/place", orderData, {
//         headers: { "Content-Type": "application/json" },
//       });

//       console.log("Order Placed:", response.data);
//       alert("Order placed successfully!");
//       localStorage.removeItem("cart");
//       navigate("/home");
//     } catch (error) {
//       console.error("Error placing order:", error.response?.data || error);
//       alert("Order placement failed. " + (error.response?.data?.message || "Please try again."));
//     }
//   };

//   return (
//     <div className={styles.paymentContainer}>
//       <h2 className={styles.heading}>Choose Payment Method</h2>
//       <label className={styles.paymentOption}>
//         <input
//           type="radio"
//           name="payment"
//           value="cash"
//           checked={paymentMethod === "cash"}
//           onChange={() => setPaymentMethod("cash")}
//           className={styles.radioInput}
//         />
//         Pay on Delivery
//       </label>
//       <label className={styles.paymentOption}>
//         <input
//           type="radio"
//           name="payment"
//           value="upi"
//           checked={paymentMethod === "upi"}
//           onChange={() => setPaymentMethod("upi")}
//           className={styles.radioInput}
//         />
//         Pay via UPI
//       </label>
//       <h3 className={styles.totalAmount}>Total Amount: ₹{totalAmount}</h3>
//       <button className={styles.checkoutButton} onClick={placeOrder}>
//         Proceed to Checkout
//       </button>
//     </div>
//   );
// };

// export default Payment;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Payment.module.css";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [userId, setUserId] = useState(null);
  const [distributorId, setDistributorId] = useState(null);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedDistributorId = localStorage.getItem("selectedDistributor");
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};

    if (!storedUserId || !storedDistributorId) {
      alert("Session expired or invalid user. Please log in again.");
      navigate("/login");
      return;
    }

    setUserId(storedUserId);
    setDistributorId(storedDistributorId);
    setCart(storedCart);
  }, [navigate]);

  if (!userId || !distributorId) return null; // Prevent rendering until values are set

  const totalAmount = Object.values(cart).reduce(
    (acc, item) => acc + (item.totalPrice || 0),
    0
  );

  const handleUPIPayment = async () => {
    try {
      const response = await axios.post("http://localhost:3008/payment/create-order", {
        amount: totalAmount * 100, // Convert to paisa (smallest currency unit)
        currency: "INR",
      });

      const options = {
        key: "rzp_test_joTCTz5pjY5NgP", // Replace with Razorpay Key ID
        amount: response.data.amount,
        currency: "INR",
        name: "Smart-Grow",
        description: "Product Purchase",
        order_id: response.data.id,
        handler: async function (paymentResponse) {
          await placeOrder(paymentResponse.razorpay_payment_id);
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error in UPI payment:", error);
      alert("Payment failed! Try again.");
    }
  };

  const placeOrder = async (paymentId = "") => {
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty. Please add products before checkout.");
      return;
    }

    const orderData = {
      userId: String(userId),
      distributorId: String(distributorId),
      products: Object.values(cart).map(({ _id, quantity, price }) => ({
        productId: _id,
        quantity,
        price,
      })),
      totalAmount,
      paymentMethod,
      // paymentId,
      status: "Pending",
    };

    try {
      const response = await axios.post("http://localhost:3008/order/place", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      navigate("/home");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Order placement failed. Try again.");
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
        Pay via UPI (Razorpay)
      </label>
      <h3 className={styles.totalAmount}>Total Amount: ₹{totalAmount}</h3>
      <button
        className={styles.checkoutButton}
        onClick={paymentMethod === "upi" ? handleUPIPayment : () => placeOrder()}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Payment;


