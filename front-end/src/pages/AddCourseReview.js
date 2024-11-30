import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AddReview.css';

const AddCourseReview = () => {
  const { id: courseId } = useParams();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You need to log in to add a review!');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          courseId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/courses/${courseId}`); // Changed to redirect to specific course page
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to submit review: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="add-review-container">
      <h1 className="add-review-header">Add a Review for the Course</h1>
      <form onSubmit={handleSubmit} className="add-review-form">
        <label className="form-label">
          Rating (1-5):
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            className="form-input"
            required
          />
        </label>
        <label className="form-label">
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-input"
            required
          />
        </label>
        <button type="submit" className="submit-button">
          Submit Review
        </button>
      </form>

      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AddCourseReview;