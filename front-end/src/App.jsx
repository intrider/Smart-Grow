import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import { BrowserRouter as Router , Route, Routes } from 'react-router-dom';
import Login from './pages/Login'
import './App.css'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProfileCompletion from './pages/Conponents/ProfileCompletion'
import DistributorDashboard from './pages/Distributor/DistributorHome'
import DistributorProfile from './pages/Distributor/DistributorProfile'
import AddProduct from './pages/Distributor/AddProduct';
import AddCategory from './pages/Distributor/AddCategory';
import ProductEdit from'./pages/Distributor/ProductEdit';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Store from './pages/Store';
import Payment from './pages/Payment';
function App() {
  const userId = localStorage.getItem('userId');
  const distributorId =localStorage.getItem('distributorId')
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home/>} />
      <Route path='/distributorDashboard' element={<DistributorDashboard />} />
      <Route path='/addproduct' Component={AddProduct}/>
      <Route path="/profileCompletion" element={<ProfileCompletion userId={userId} />} />
      <Route path='/distributorprofile' element={<DistributorProfile distributorId={distributorId} />} />
      <Route path='/addcategory' element={<AddCategory/>}/>
      <Route path='/productedit/:productId' element={<ProductEdit />} />
      <Route path='/category/:categoryId'element={<Product/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/store'element={<Store/>}/>
      <Route path='/products/:categoryId'element={<Product />}/>
      <Route path='/payment' element={<Payment/>}/>
      </Routes>
    )
}

export default App
