import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateCourse.css';

const CreateCourse = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Unauthorized: Please log in to add a course.');
      }
      await axios.post(
        'http://localhost:5000/api/courses',
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    }
  };

  return (
    <div className="create-course">
      <h1>Create Course</h1>
      <form className="create-course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Course Name"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="primary-button">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
