import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateProfessor.css'; // Reuse the same CSS for styling

const CreateCourse = () => {
  const [prefix, setPrefix] = useState('');
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [description, setDescription] = useState('');
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
        { 
          prefix, 
          number: parseInt(number, 10), // Ensure number is stored as an integer
          name, 
          prerequisites: prerequisites.split(',').map((p) => p.trim()), // Split and trim prerequisites
          description 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/home?view=courses'); // Redirect to the courses list view
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    }
  };

  return (
    <div className="create-professor">
      <h1>Create Course</h1>
      <form className="create-professor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Prefix:</label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="e.g., CS"
            required
          />
        </div>
        <div className="form-group">
          <label>Course Number:</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="e.g., 101"
            required
          />
        </div>
        <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Course Name"
            required
          />
        </div>
        <div className="form-group">
          <label>Prerequisites:</label>
          <input
            type="text"
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            placeholder="e.g., MATH 101, CS 102"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course Description"
            rows="4"
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
