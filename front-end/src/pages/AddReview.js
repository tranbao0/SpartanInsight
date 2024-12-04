import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AddReview.css'; // Assuming CSS file is named AddReview.css

const AddReview = () => {
  const { id: courseId } = useParams(); 
  const { id: professorId } = useParams(); // Extract professorId from the URL
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
          professorId, // Send professorId in the request body
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // alert('Review submitted successfully!');
      navigate(`/professors/${professorId}`); // Redirect back to the professor's review page
    } catch (error) {
      console.error(error);
      alert('Failed to submit review');
    }
  };

  return (
    <div className="add-review-container">
      <h1 className="add-review-header">Add a Review</h1>
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
        <button type="submit" className="submit-button">Submit Review</button>
      </form>
    </div>
  );
};

export default AddReview;
