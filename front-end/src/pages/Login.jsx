// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import styles from './login.module.css';

// function Login() {
//   const [email, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   async function sendData() {
//     if (email === '' || password === '') {
//       alert("Username and password can't be empty");
//       return;
//     }
//     try {
//       const response = await axios.post('http://localhost:3008/user/login', {
//         email: email,
//         password: password
//       });
//       console.log(response.data);
//       alert('Login successful');
//       navigate('/home');
//     } catch (error) {
//       console.log('Error logging in:', error);
//       alert('Login failed');
//     }
//   }

//   return (
//     <>
//       <meta charSet="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <link rel="stylesheet"/>
//       <title>Login</title>
//       <div className={styles.loginContainer}>
//         <h2>Login</h2>
//         <form onSubmit={(e) => { e.preventDefault(); sendData(); }}>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             placeholder="email"
//             required
//             value={email}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <input
//             type="password"
//             id="password"
//             name="password"
//             placeholder="Password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button type="submit">Login</button>
//         </form>
//         <p>
//           Don't have an account? <Link to="/signup">Sign up</Link>
//         </p>
//       </div>
//     </>
//   );
// }

// export default Login;


import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  async function sendData() {
    if (email === '' || password === '') {
      alert("Email and password can't be empty");
      return;
    }
    const loginData={email,password};
    console.log("sending login data",`http://localhost:3008/${role}/login`,loginData);
    try {
      const response = await axios.post(`http://localhost:3008/${role}/login`, loginData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      console.log("stored UserId:",localStorage.getItem("userId"));
      localStorage.setItem('role', response.data.role);
      console.log(response.data);
      alert('Login successful');
      if(response.data.role === 'distributor') {
        localStorage.setItem('distributorId', response.data.distributorId);
        navigate('/distributorDashboard');
      }else{
      navigate('/home');
      }
    } catch (error) {
      console.log('Error logging in:', error);
      alert('Login failed');
    }
  }
  return (
    <div id="loginPage">
      <div className="login-box">
        <h2>Login</h2>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="user">User</option>
          <option value="distributor">Distributor</option>
        </select>
        <form onSubmit={(e) => { e.preventDefault(); sendData(); }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}
export default Login;

