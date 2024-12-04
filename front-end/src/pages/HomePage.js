import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  // Handle pressing 'Enter' to trigger the search
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && query.trim() !== '') {
      navigate(`/search?query=${query}`);
    }
  };

  const handleSearchClick = () => {
    if (query.trim() !== '') {
      navigate(`/search?query=${query}`);
    }
  };
  useEffect(() => {
    const title = document.querySelector('.home-page header h1');
    const subtitle = document.querySelector('.home-page header h2');
    let lastX = 0;
    let lastY = 0;
    let lastX2 = 0;  // for h2
    let lastY2 = 0;  // for h2
    let animationFrameId = null;
    const easeAmount = 0.08;
    
    const handleMouseMove = (e) => {
      if (title && subtitle) {
        // For h1
        const rect = title.getBoundingClientRect();
        const titleCenterX = rect.left + rect.width / 2;
        const titleCenterY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - titleCenterX;
        const deltaY = e.clientY - titleCenterY;
        
        // For h2
        const rect2 = subtitle.getBoundingClientRect();
        const title2CenterX = rect2.left + rect2.width / 2;
        const title2CenterY = rect2.top + rect2.height / 2;
        
        const deltaX2 = e.clientX - title2CenterX;
        const deltaY2 = e.clientY - title2CenterY;
        
        // Calculate distances
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const distance2 = Math.sqrt(deltaX2 * deltaX2 + deltaY2 * deltaY2);
        const maxDistance = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);
        
        // Normalize offsets
        const minOffset = 8;
        const maxOffset = 12;
        const normalizedOffset = minOffset + (distance / maxDistance) * (maxOffset - minOffset);
        const normalizedOffset2 = minOffset + (distance2 / maxDistance) * (maxOffset - minOffset);
        
        // Prevent division by zero
        const safeDistance = Math.max(distance, 0.1);
        const safeDistance2 = Math.max(distance2, 0.1);
        
        // Calculate targets
        const targetX = -(deltaX / safeDistance) * normalizedOffset;
        const targetY = -(deltaY / safeDistance) * normalizedOffset;
        const targetX2 = -(deltaX2 / safeDistance2) * normalizedOffset2 * 0.5; // Reduced effect for h2
        const targetY2 = -(deltaY2 / safeDistance2) * normalizedOffset2 * 0.5; // Reduced effect for h2
        
        // Smooth animation loop
        const updateShadow = () => {
          // Update h1
          lastX += (targetX - lastX) * easeAmount;
          lastY += (targetY - lastY) * easeAmount;
          
          // Update h2
          lastX2 += (targetX2 - lastX2) * easeAmount;
          lastY2 += (targetY2 - lastY2) * easeAmount;
          
          // Check if shadows are "stuck"
          const movement = Math.abs(targetX - lastX) + Math.abs(targetY - lastY);
          const movement2 = Math.abs(targetX2 - lastX2) + Math.abs(targetY2 - lastY2);
          
          if (movement < 0.01) {
            lastX = targetX;
            lastY = targetY;
          }
          if (movement2 < 0.01) {
            lastX2 = targetX2;
            lastY2 = targetY2;
          }
          
          // Bound checking
          lastX = Math.min(Math.max(lastX, -maxOffset), maxOffset);
          lastY = Math.min(Math.max(lastY, -maxOffset), maxOffset);
          lastX2 = Math.min(Math.max(lastX2, -maxOffset), maxOffset);
          lastY2 = Math.min(Math.max(lastY2, -maxOffset), maxOffset);
          
          // Apply shadows
          title.style.textShadow = `${lastX}px ${lastY}px 0 var(--school-gold)`;
          subtitle.style.textShadow = `${lastX2}px ${lastY2}px 0 var(--school-gold)`;
          
          animationFrameId = requestAnimationFrame(updateShadow);
        };
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        updateShadow();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [navigate]);

  // Only redirect if coming directly from login
  const fromAuth = location.state?.fromAuth;
  const isLoggedIn = localStorage.getItem('token');

  if (isLoggedIn && fromAuth) {
    navigate('/listings');
    return null;
  }

  return (
    <section className="home-page">
      <div className="main-header">
        <div className="header-buttons-container">
          <div className="login-button">
            <button className="button" onClick={() => navigate("/login")}>Log In</button>
          </div>
          <div className="signup-button">
            <button className="button" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </div>
      <div className="main-content">
        <header>
          <h1><strong>Spartan Insights</strong></h1>
          <h2>FIND, RATE, AND REVIEW SJSU PROFESSORS AND COURSES</h2>
        </header>
        <div className="search-bar">
        <input
          type="text"
          className="search-box"
          placeholder="Search for professors or courses..."
          value={query}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}  // Handle 'Enter' key press
        />
      </div>
        <div className="content-buttons">
          <button className="button" onClick={() => navigate('/listings?view=courses')}>View Courses</button>
          <button className="button" onClick={() => navigate('/listings?view=professors')}>View Professors</button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;