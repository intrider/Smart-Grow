import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Product.module.css";

const Product = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || {});

  useEffect(() => {
    fetchProductsByCategory();
    fetchAllProductsByDistributor();
  }, [categoryId]);

  const fetchProductsByCategory = async () => {
    try {
      const response = await axios.get(`http://localhost:3008/distributor/products/${categoryId}`);
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchAllProductsByDistributor = async () => {
    const distributorId = localStorage.getItem("selectedDistributor");
    if (!distributorId) return;

    try {
      const response = await axios.get(`http://localhost:3008/distributor/products-by-distributor/${distributorId}`);
      setAllProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching distributor products:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
      setFilteredProducts(products);
      return;
    }

    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product._id]) {
        updatedCart[product._id].quantity += 1;
        updatedCart[product._id].totalPrice = updatedCart[product._id].quantity * updatedCart[product._id].price;
      } else {
        updatedCart[product._id] = { ...product, quantity: 1, totalPrice: product.price };
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId].quantity > 1) {
        updatedCart[productId].quantity -= 1;
        updatedCart[productId].totalPrice = updatedCart[productId].quantity * updatedCart[productId].price;
      } else {
        delete updatedCart[productId];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <div className={styles.productContainer}>
      <h2 className={styles.heading}>Products</h2>
      <input
        type="text"
        placeholder="Search any product..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={styles.searchBar}
      />

      <button className={styles.cartBtn} onClick={() => navigate("/cart")}>
        🛒 View Cart
      </button>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ⬅ Back to Store
      </button>

      <div className={styles.productGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <img src={`http://localhost:3008/${product.image}`} alt={product.name} className={styles.productImage} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              {!cart[product._id] ? (
                <button className={styles.addToCart} onClick={() => addToCart(product)}>Add to Cart</button>
              ) : (
                <div className={styles.quantityControls}>
                  <button onClick={() => decreaseQuantity(product._id)}>-</button>
                  <span>{cart[product._id].quantity}</span>
                  <button onClick={() => addToCart(product)}>+</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className={styles.notFound}>Product not found</p>
        )}
      </div>
    </div>
  );
};

export default Product;
