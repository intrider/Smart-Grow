import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Distribprofile.module.css';
import { useNavigate } from 'react-router-dom';

function DistributorProfile() {
  const [distributor, setDistributor] = useState({
    name: '',
    email: '',
    phone: '',
    AadharNo: '',
    companyName: '',
    companyLocation: '',
    DistributionArea: '',
    state: '',
    district: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const distributorId = localStorage.getItem('distributorId');

  useEffect(() => {
    const fetchDistributorData = async () => {
      try {
        const response = await axios.get(`http://localhost:3008/distributor/${distributorId}`);
        setDistributor(response.data);
      } catch (error) {
        console.error('Error fetching distributor details:', error);
      }
    };
    fetchDistributorData();
  }, [distributorId]);

  const handleChange = (e) => {
    setDistributor({ ...distributor, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3008/distributor/${distributorId}`, distributor);
      alert('Profile updated successfully');
      navigate('/distributorDashboard');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating distributor profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Distributor Profile</h2>
      <form className={styles.profileForm}>
        <label className={styles.label}>Name:</label>
        <input className={styles.input} type="text" name="name" value={distributor.name} onChange={handleChange} disabled={!isEditing} />
        
        <label className={styles.label}>Email:</label>
        <input className={styles.input} type="email" name="email" value={distributor.email} disabled />

        <label className={styles.label}>Phone:</label>
        <input className={styles.input} type="text" name="phone" value={distributor.phone} onChange={handleChange} disabled={!isEditing} />

        <label className={styles.label}>Aadhar No:</label>
        <input className={styles.input} type="text" name="AadharNo" value={distributor.AadharNo} disabled />

        <label className={styles.label}>Company Name:</label>
        <input className={styles.input} type="text" name="companyName" value={distributor.companyName} onChange={handleChange} disabled={!isEditing} />

        <label className={styles.label}>Company Location:</label>
        <input className={styles.input} type="text" name="companyLocation" value={distributor.companyLocation} onChange={handleChange} disabled={!isEditing} />

        <label className={styles.label}>Distribution Area:</label>
        <input className={styles.input} type="text" name="DistributionArea" value={distributor.DistributionArea} onChange={handleChange} disabled={!isEditing} />

        <label className={styles.label}>State:</label>
        <input className={styles.input} type="text" name="state" value={distributor.state} onChange={handleChange} disabled={!isEditing} />
        
        <label className={styles.label}>District:</label>
        <input className={styles.input} type="text" name="district" value={distributor.district} onChange={handleChange} disabled={!isEditing} />

        <div className={styles.buttonContainer}>
          {!isEditing ? (
            <button type="button" className={styles.editButton} onClick={() => setIsEditing(true)}>Edit Profile</button>
          ) : (
            <button type="button" className={styles.updateButton} onClick={handleUpdate}>Update</button>
          )}
        </div>
      </form>
    </div>
  );
}

export default DistributorProfile;
