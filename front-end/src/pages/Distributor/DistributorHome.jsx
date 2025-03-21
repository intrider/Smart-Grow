import React from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Distributor.css';

function DistributorHome() {
  const [distributor, setDistributor] = useState({
    name: '',
    email: '',
    phone: '',
    AadharNo: '',
    companyName: '',
    companyLocation: '',
    DistributionArea: ''
  });

  const [products, setProducts] = useState([]);
  const[categories,setCategories]=useState([])
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const ordersPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistributorData = async () => {
      try {
        const distributorId =localStorage.getItem('distributorId')
        if(!distributorId){
          console.error('No distributor ID found');
          return;
        }
        const response = await axios.get(`http://localhost:3008/distributor/${distributorId}`);
        setDistributor(response.data);
      } catch (error) {
        console.error('Error fetching distributor data', error);
      }
    };

    const fetchProductsData = async () => {
      try {
        const distributorId = localStorage.getItem('distributorId');
        const response = await axios.get(`http://localhost:3008/distributor/product?distributorId=${distributorId}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products data', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const distributorId = localStorage.getItem('distributorId')
        const response = await axios.get(`http://localhost:3008/distributor/category?distributorId=${distributorId}`);
        // console.log('Categories Data:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    const fetchOrders = async () => {
      try {
        const distributorId = localStorage.getItem("distributorId");
        if (!distributorId) {
          console.error("No distributor ID found");
          return;
        }
        const response = await axios.get(`http://localhost:3008/order/${distributorId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };
  
    
    fetchDistributorData();
    fetchProductsData();
    fetchCategories();
    fetchOrders();
  }, []);

  const handleProductDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3008/distributor/product/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product', error);
      alert('Error deleting product');
    }
  };
  const handleCategoryDelete = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:3008/distributor/category/${categoryId}`);
      setCategories(categories.filter((category) => category._id !== categoryId));
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category', error);
      alert('Error deleting category');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('distributorId');
    navigate('/');
  };
  const markOrderCompleted = async (orderId) => {
    try {
      await axios.put(`http://localhost:3008/order/update/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Completed" } : order
        )
      );
      alert("Order marked as completed.");
    } catch (error) {
      console.error("Error updating order status", error);
      alert("Failed to update order status.");
    }
  };
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Distributor Panel</h2>
        <p id="distributor-name">
          Welcome, <span>{distributor.name}</span>
        </p>
        <ul>
          <li>
            <a href="#products">Products</a>
          </li>
          <li>
            <a href="#categories">Categories</a>
          </li>
          <li>
            <a href="#orders">Orders</a>
          </li>
          <li>
            <Link to="/distributorprofile"> Edit Profile</Link>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </aside>
      <main className="content">
        <header className="topbar">
          <h1>Distributor Dashboard</h1>
        </header>
        <section id="products" className="card">
          <h2>Products</h2>
          <button id="add-product" onClick={() => navigate('/addproduct')}>Add Product</button>
          <div className="product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <img src={`http://localhost:3008/${product.image}`} alt={product.name} className="product-image"/>
                <p className="product-name">{product.name}</p>
                <p className="product-category">{product.category?.name || 'Uncategorized'}</p>
                <p className="product-price">₹{product.price}</p>
                <div className="product-actions">
                  <button className="edit-btn" onClick={() => navigate(`/productedit/${product._id}`)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleProductDelete(product._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <h4></h4>
        </section>
        <section id="categories" className="card">
          <h2>Categories</h2>
          <button onClick={()=>navigate('/addcategory')}>Add Category</button>
          <ul>
            {categories.map(category => (
              <li key={category._id}>
                <p>{category.name}</p>
                <img src={`http://localhost:3008/${category.image}`} alt={category.name} className="category-image"/>
                <button className="delete-btn" onClick={() => handleCategoryDelete(category._id)}>Delete</button>
                </li>
            ))}
          </ul>
          <h3></h3>
        </section>
        <section id="orders" className="card orders-section">
  <h2>Orders</h2>
  {orders.length > 0 ? (
    <div className="table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Shop Location</th>
            <th>Phone No</th>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Payment Mode</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage).map((order) => (
            <tr key={order._id} className={`order-row ${order.status === "Completed" ? "completed" : "pending"}`}>
              <td>{order.userId?.name || "N/A"}</td>
              <td>{order.userId?.shopLocation || "N/A"}</td>
              <td>{order.userId?.phone || "N/A"}</td>
              <td>
                {order.products.map((product, index) => (
                  <p key={index}>{product.productId?.name || "Unknown Product"}</p>
                ))}
              </td>
              <td>
                {order.products.map((product, index) => (
                  <p key={index}>{product.quantity}</p>
                ))}
              </td>
              <td>₹{order.totalAmount}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <span className={`status-badge ${order.status === "Completed" ? "completed-badge" : "pending-badge"}`}>
                  {order.status}
                </span>
              </td>
              <td>
                {order.status === "Pending" && (
                  <button className="complete-btn" onClick={() => markOrderCompleted(order._id)}>
                    Mark as Completed
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No orders available.</p>
  )}
    {orders.length > ordersPerPage && (
    <div className="pagination">
      <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>❮ Prev</button>
      <span> Page {currentPage} of {Math.ceil(orders.length / ordersPerPage)} </span>
      <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}>Next ❯</button>
    </div>
  )}
</section>
      </main>
    </div>
  );
}

export default DistributorHome;