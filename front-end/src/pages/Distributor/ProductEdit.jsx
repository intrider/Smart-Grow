import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './ProductEdit.css'

const EditProduct = ({ onUpdate, onCancel }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3008/distributor/product/${productId}`);
        const productData = response.data;
        setProduct(productData);
        setName(productData.name);
        setCategory(productData.category?._id || "");
        setPrice(productData.price);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const distributorId = localStorage.getItem("distributorId")
        const response = await axios.get(`http://localhost:3008/distributor/category?distributorId=${distributorId}`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId]);

  if (loading) {
    return <p>Loading product details...</p>;
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(`http://localhost:3008/distributor/product/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Product updated successfully!");
      navigate('/distributorDashboard');
      onUpdate(response.data);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <label>Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label>Change Image:</label>
        <input type="file" onChange={handleImageChange} />

        <div className="button-group">
          <button type="submit">Update</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
