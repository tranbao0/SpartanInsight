import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const userData = { email, password };

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:5000/api/auth/login', userData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true); // update state to trigger re-render
        navigate('/home');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="main-header">
        <div className="header-buttons-container">
          <button className="button primary-button" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>
      <div className="main-content">
        <header>
          <h1>Login</h1>
        </header>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              placeholder="Enter your @sjsu.edu email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <div className="action-row">
              <button 
                type="button" 
                className="signup-link" 
                onClick={() => navigate('/signup')} // Sign up redirect button
              >
                Don't have an account? Sign up
              </button>
              <button 
                type="submit" 
                className="primary-button" 
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
