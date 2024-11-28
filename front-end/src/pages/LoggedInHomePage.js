import React, { useEffect, useState } from 'react';
import './HomePage.css';
import './LoggedInHomePage.css';
import { useNavigate } from 'react-router-dom';

const LoggedInHomePage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const title = document.querySelector('.home-page header h1');
    let lastX = 0;
    let lastY = 0;
    let animationFrameId = null;
    const easeAmount = 0.08;

    const handleMouseMove = (e) => {
      if (title) {
        const rect = title.getBoundingClientRect();
        const titleCenterX = rect.left + rect.width / 2;
        const titleCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - titleCenterX;
        const deltaY = e.clientY - titleCenterY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.sqrt(
          window.innerWidth * window.innerWidth +
          window.innerHeight * window.innerHeight
        );

        const minOffset = 8;
        const maxOffset = 12;
        const normalizedOffset =
          minOffset + (distance / maxDistance) * (maxOffset - minOffset);

        const safeDistance = Math.max(distance, 0.1);

        const targetX = -(deltaX / safeDistance) * normalizedOffset;
        const targetY = -(deltaY / safeDistance) * normalizedOffset;

        const updateShadow = () => {
          lastX += (targetX - lastX) * easeAmount;
          lastY += (targetY - lastY) * easeAmount;

          const movement =
            Math.abs(targetX - lastX) + Math.abs(targetY - lastY);

          if (movement < 0.01) {
            lastX = targetX;
            lastY = targetY;
          }

          lastX = Math.min(Math.max(lastX, -maxOffset), maxOffset);
          lastY = Math.min(Math.max(lastY, -maxOffset), maxOffset);

          title.style.textShadow = `${lastX}px ${lastY}px 0 var(--school-gold)`;

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
  }, []);

  return (
    <section className="home-page">
      <div className="main-header">
        <div
          className="hamburger-container"
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <button className="hamburger-button">&#9776;</button>
        </div>
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button
          className="button"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
      <div className="main-content">
        <header>
          <h1>
            <strong>Welcome Back</strong>
          </h1>
        </header>
        <input
          type="text"
          aria-label="search"
          placeholder="Search Course or Professor"
        />
        <div className="content-buttons">
          <button className="button" onClick={() => navigate('/courses')}>
            View Courses
          </button>
          <button className="button" onClick={() => navigate('/professors')}>
            View Professors
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoggedInHomePage;
