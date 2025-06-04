import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./Store.module.css";

function Store() {
  const [products, setProducts] = useState([]);
  const [updatedStocks, setUpdatedStocks] = useState({});
  const distributorId = localStorage.getItem('distributorId');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3008/distributor/product?distributorId=${distributorId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [distributorId]);  // <-- Fixes the infinite loop

  const handleStockChange = (id, newStock) => {
    setUpdatedStocks(prev => ({
      ...prev,
      [id]: newStock
    }));
  };

  const updateStock = async (id) => {
    const stock = updatedStocks[id]; // Get the latest value from updatedStocks

    try {
      console.log(`Sending stock update for ${id} with stock: ${stock}`);
      const response = await axios.put(
        `http://localhost:3008/distributor/product/${id}/stock`,
        { stock: Number(stock) } // Ensure it's a number
      );
      console.log("Response from server:", response.data);
      
      if (response.status === 200) {
        setProducts(products.map(product =>
          product._id === id ? { ...product, stock: Number(stock) } : product
        ));
        alert("Stock updated successfully");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Error updating stock");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Store Management</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Size</th>
            <th>Available Stock</th>
            <th>Update Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td><img src={`http://localhost:3008/${product.image}`} alt={product.name} className={styles.image} /></td>
              <td>{product.name}</td>
              <td>{product.size}</td>
              <td>{product.stock}</td>
              <td>
                <input
                  type="number"
                  value={updatedStocks[product._id] || product.stock}
                  onChange={(e) => handleStockChange(product._id, e.target.value)}
                />
                <button onClick={() => updateStock(product._id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Store;
