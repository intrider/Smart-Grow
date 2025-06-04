import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "./Conponents/Navbar";
import Footer from "./Conponents/Footer";

const Home = () => {
  // const [categories, setCategories] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [shopLocation, setShopLocation] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const storedShopLocation = localStorage.getItem("shopLocation");

  //   if (!storedShopLocation) {
  //     console.warn("Shop location is missing! Redirecting to profile completion.");
  //     alert("Please complete your profile first.");
  //     return;
  //   }

  //   setShopLocation(storedShopLocation);

  //   const fetchCategories = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3008/distributor/category-with-products?shopLocation=${storedShopLocation}`
  //       );
  //       setCategories(response.data.categories);
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  // if (!shopLocation) {
  //   return <p>Please complete your profile to view products.</p>;
  // }

  // if (loading) {
  //   return <p>Loading categories...</p>;
  // }

  return (
    <>
      <Navbar />
      <div id="home-page">
        <div className="home-container">
          <section id="main-page">
            <h3>Welcome to Smart-Grow</h3>
            <p>Shop Smarter, Live Better</p>
            <button onClick={() => navigate("/store")}>Get Started</button>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
