import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "./Addcat.module.css";

function AddProduct() {
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    image: null
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const distributorId = localStorage.getItem('distributorId');

  useEffect(() => {
    const fetchCategories = async () => {
      if (!distributorId) {
        console.error("Distributor ID not found. Please log in again.");
        alert("Session expired. Please log in again.");
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3008/distributor/category?distributorId=${distributorId}`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [distributorId, navigate]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm({
      ...productForm,
      [name]: value
    });
  };

  const handleProductImageChange = (e) => {
    setProductForm({
      ...productForm,
      image: e.target.files[0]
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.category || !productForm.price || !productForm.image) {
      alert("All fields are required.");
      return;
    }

    if (!distributorId) {
      alert("Session expired. Please log in again.");
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('category', productForm.category);
    formData.append('price', productForm.price);
    formData.append('image', productForm.image);
    formData.append('distributorId', distributorId); 

    console.log('sending data',Object.fromEntries(formData.entries()));
    
    try {
      await axios.post('http://localhost:3008/distributor/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product added successfully');
      navigate('/distributorDashboard');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Add New Product</h2>
        <form onSubmit={handleProductSubmit}>
          <label className={styles.label} htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            name="name"
            value={productForm.name}
            onChange={handleProductChange}
            className={styles.input}
            required
          />
          <label className={styles.label} htmlFor="productCategory">Category:</label>
          <select
            id="productCategory"
            name="category"
            value={productForm.category}
            onChange={handleProductChange}
            className={styles.input}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <label className={styles.label} htmlFor="productPrice">Price:</label>
          <input
            type="number"
            id="productPrice"
            name="price"
            value={productForm.price}
            onChange={handleProductChange}
            className={styles.input}
            required
          />

          <label className={styles.label} htmlFor="productImage">Upload Image:</label>
          <input
            type="file"
            id="productImage"
            name="image"
            onChange={handleProductImageChange}
            className={styles.fileInput}
            required
          />

          <button type="submit" className={styles.button}>
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
