import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import './CreateProfessor.css'; // Reuse the same CSS for styling

const CreateCourse = () => {
  const [prefix, setPrefix] = useState('');
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [description, setDescription] = useState('');
=======
import './CreateCourse.css';

const CreateCourse = () => {
  const [name, setName] = useState('');
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
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
<<<<<<< HEAD
        { 
          prefix, 
          number: parseInt(number, 10), // Ensure number is stored as an integer
          name, 
          prerequisites: prerequisites.split(',').map((p) => p.trim()), // Split and trim prerequisites
          description 
        },
=======
        { name },
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
<<<<<<< HEAD
      navigate('/home?view=courses'); // Redirect to the courses list view
=======
      navigate('/courses');
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.');
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="create-course">
      <h1>Create Course</h1>
      <form className="create-course-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Course Name"
            required
          />
        </div>
<<<<<<< HEAD
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
=======
>>>>>>> edaac74835e9838b33e3ed231f31b8d043caf16b
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="primary-button">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
