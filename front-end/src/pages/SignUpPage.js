import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './SignUpPage.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // SJSU domain validation
    if (!email.toLowerCase().endsWith('@sjsu.edu')) {
      return "Please use your SJSU email address (@sjsu.edu).";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const userData = { 
      username, 
      email: email.toLowerCase(), // Ensure email is lowercase
      password 
    };

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      console.log('Response from server:', response);
      navigate('/');
    } catch (err) {
      console.error('Error during signup:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Clear error when user starts typing again
    if (error && error.includes('email')) {
      setError('');
    }
  };

  return (
    <section className="signup-page">
      <div className="main-header">
        <div className="header-buttons-container">
          <button className="button primary-button" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>
      <div className="main-content">
        <header>
          <h1>Sign Up</h1>
        </header>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input 
              type="text" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              placeholder="Enter your @sjsu.edu email" 
              value={email}
              onChange={handleEmailChange}
              pattern=".+@sjsu\.edu$"
              title="Please use your SJSU email address"
              required 
            />
            <small className="email-hint">Must be a valid @sjsu.edu email address</small>
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              minLength="6"
              required 
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              minLength="6"
              required 
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <div className="action-row">
              <button 
                type="button" 
                className="login-link" 
                onClick={() => navigate('/login')}
              >
                Already signed up?
              </button>
              <button 
                type="submit" 
                className="primary-button" 
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpPage;