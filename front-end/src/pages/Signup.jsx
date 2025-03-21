import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css';

const statesAndDistricts = {
  Kerala: ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha','Ernakulam'],
  TamilNadu: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
};

function Signup() {
  const [role, setRole] = useState('user');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [AadharNo, setAadharNo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [DistributionArea, setDistributionArea] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');

  const handleStateChange = (e) => {
    setState(e.target.value);
    setDistrict(''); // Reset district when state changes
  };

  async function handleSignup(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    let signupData = { username, email, password };
    if (role === 'distributor') {
      signupData = {
        name: username,
        email,
        password,
        phone,
        AadharNo,
        companyName,
        companyLocation,
        DistributionArea,
        state,
        district,
      };
    }

    console.log('Sending signup data:', signupData);

    try {
      const response = await axios.post(`http://localhost:3008/${role}/signup`, signupData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Signup successful:', response.data);
      alert('Signup successful');
    } catch (error) {
      console.error('Error signing up:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  }

  return (
    <div id="signup-page">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="user">User</option>
          <option value="distributor">Distributor</option>
        </select>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

          {role === 'distributor' && (
            <>
              <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <input type="text" placeholder="Aadhar Number" value={AadharNo} onChange={(e) => setAadharNo(e.target.value)} required />
              <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              <input type="text" placeholder="Company Location" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} required />
              <input type="text" placeholder="Distribution Area" value={DistributionArea} onChange={(e) => setDistributionArea(e.target.value)} required />
              <select value={state} onChange={handleStateChange} required>
                <option value="">Select State</option>
                {Object.keys(statesAndDistricts).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} required>
                <option value="">Select District</option>
                {state && statesAndDistricts[state].map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </>
          )}
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
