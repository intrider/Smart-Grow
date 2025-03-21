import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Store.module.css';

const statesAndDistricts = {
  Kerala: ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Ernakulam'],
  TamilNadu: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
};

function Store() {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(localStorage.getItem('selectedDistributor') || null);
  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('categories')) || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (district) {
      fetchDistributors();
    }
  }, [district]);

  useEffect(() => {
    if (selectedDistributor) {
      fetchCategories(selectedDistributor);
    }
  }, [selectedDistributor]);

  const fetchDistributors = async () => {
    try {
      console.log(`Fetching distributors for district: ${district}`);
      const response = await axios.get(`http://localhost:3008/distributor/by-location?district=${district}`);
      setDistributors(response.data);
    } catch (error) {
      console.error('Error fetching distributors:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to fetch distributors. Please try again.");
    }
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
    setDistrict('');
    setDistributors([]);
    setSelectedDistributor(null);
    localStorage.removeItem('selectedDistributor');
    localStorage.removeItem('categories');
  };

  const fetchCategories = async (distributorId) => {
    try {
      console.log(`Fetching categories for distributor ID: ${distributorId}`);
      const response = await axios.get(`http://localhost:3008/distributor/category-with-products?distributorId=${distributorId}`);
      setCategories(response.data.categories);
      localStorage.setItem('categories', JSON.stringify(response.data.categories));
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to fetch categories. Please try again.");
    }
  };

  const handleDistributorClick = (distributorId) => {
    setSelectedDistributor(distributorId);
    localStorage.setItem('selectedDistributor', distributorId);
    fetchCategories(distributorId);
  };

  return (
    <div className={styles.storeContainer}>
      <h2 className={styles.heading}>Select Your Location</h2>
      <select className={styles.dropdown} value={state} onChange={handleStateChange} required>
        <option value="">Select State</option>
        {Object.keys(statesAndDistricts).map((state) => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
      <select className={styles.dropdown} value={district} onChange={(e) => setDistrict(e.target.value)} required>
        <option value="">Select District</option>
        {state && statesAndDistricts[state].map((dist) => (
          <option key={dist} value={dist}>{dist}</option>
        ))}
      </select>
      {distributors.length > 0 && (
        <>
          <h3 className={styles.subHeading}>Select Distributor</h3>
          <div className={styles.distributorGrid}>
  {distributors.map((dist) => (
    <div key={dist._id} className={styles.distributorCard} onClick={() => handleDistributorClick(dist._id)}>
      <h3 className={styles.distributorName}>{dist.name}</h3>
      <p className={styles.distributorCompany}><strong>Company:</strong> {dist.companyName}</p>
      <p className={styles.distributorLocation}><strong>Location:</strong> {dist.companyLocation}</p>
    </div>
  ))}
</div>
        </>
      )}
      {selectedDistributor && categories.length > 0 && (
        <>
          <h3 className={styles.subHeading}>Categories</h3>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <div key={cat._id} className={styles.categoryCard} onClick={() => navigate(`/products/${cat._id}`)}>
                <img src={`http://localhost:3008/${cat.image}`} alt={cat.name} className={styles.categoryImage} />
                <p className={styles.categoryName}>{cat.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Store;
