import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Orders.module.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");
  console.log("User ID:", userId);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        console.error("Error: userId is missing!");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3008/order/user/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [userId]);
  return (
    <div className={styles.ordersContainer}>
      <h2 className={styles.ordersTitle}>Your Orders</h2>
      {orders.length === 0 ? (
        <p className={styles.noOrders}>No orders found.</p>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <h3 className={styles.orderId}>Order ID: {order._id}</h3>
              <p className={styles.orderPrice}>
                Total Price: <span>₹{order.totalAmount}</span>
              </p>
              <h4 className={styles.productTitle}>Products:</h4>
              <ul className={styles.productList}>
                {order.products.map((product, index) => (
                  <li key={index} className={styles.productItem}>
                    <img
                      src={`http://localhost:3008/${product.productId?.image}`}
                      alt={product.productId?.name || "Product"}
                      className={styles.productImage}
                    />
                    <div className={styles.productDetails}>
                      <p>{product.productId?.name || "Unknown Product"}</p>
                      <p>Price: ₹{product.productId?.price || "N/A"}</p>
                      <p>Quantity: {product.quantity}x</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p
                className={`${styles.orderStatus} ${
                  order.status === "Completed" ? styles.delivered : styles.pending
                }`}
              >
                {order.status === "Completed" ? "Delivered" : "Pending"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
