import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileCompletion.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProfileCompletion = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    phone: "",
    AadharNo: "",
    shopLocation: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3008/user/complete-profile/${userId}`,
        formData
      );

      console.log("Profile update request sent to:", `http://localhost:3008/user/complete-profile/${userId}`);
      console.log("Sent data:", formData);

      localStorage.setItem("shopLocation", formData.shopLocation);

      alert(response.data.message);
    } catch (error) {
      console.error("Error completing profile:", error);
      alert("Error completing profile. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div id="profile">
        <div className="profile-completion">
          <h2>Complete Your Profile</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="Shop Name"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
            />
            <input
              type="text"
              name="AadharNo"
              value={formData.AadharNo}
              onChange={handleChange}
              placeholder="Aadhar Number"
              required
            />
            <input
              type="text"
              name="shopLocation"
              value={formData.shopLocation}
              onChange={handleChange}
              placeholder="Shop Location"
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileCompletion;
