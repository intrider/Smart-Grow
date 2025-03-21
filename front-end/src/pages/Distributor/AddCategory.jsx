import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Addcat.module.css"; // Import the CSS module

function AddCategory() {
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: null,
  });

  const navigate = useNavigate();
  const distributorId = localStorage.getItem("distributorId"); // Get distributor ID from localStorage

  // Handle input changes
  const handleInputChange = (e) => {
    setCategoryForm({ ...categoryForm, name: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only images (JPEG, PNG, JPG, WEBP) are allowed!");
        return;
      }

      setCategoryForm({ ...categoryForm, image: file });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryForm.name || !categoryForm.image) {
      alert("Please fill in all fields.");
      return;
    }

    if (!distributorId) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryForm.name);
    formData.append("image", categoryForm.image);
    formData.append("distributorId", distributorId);

    // Debugging: Log FormData content
    console.log("Sending category data:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3008/distributor/category",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Category added successfully!");
      navigate("/distributorDashboard");
    } catch (error) {
      console.error("Error adding category:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add category.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Add New Category</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Category Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter category name"
            value={categoryForm.name}
            onChange={handleInputChange}
            className={styles.input}
            required
          />

          <label className={styles.label}>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
            required
          />

          <button type="submit" className={styles.button}>
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;
