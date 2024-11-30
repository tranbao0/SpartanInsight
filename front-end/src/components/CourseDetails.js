import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // New state for review form
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const fetchCourseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Unauthorized: Please log in to view course details.');
      }
      const response = await axios.get(`http://localhost:5000/api/courses/${id}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(response.data.course);
      setReviews(response.data.reviews);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course details.');
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const handleSubmitReview = async (e) => {
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
          courseId: id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form and refresh reviews
      setRating('');
      setComment('');
      setIsAddingReview(false);
      fetchCourseDetails();
    } catch (error) {
      console.error(error);
      alert('Failed to submit review');
    }
  };

  if (error) {
    return <div className="course-details-error">{error}</div>;
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-details">
      <div className="course-header">
        <h1>{`${course.prefix || ''} ${course.number || ''} - ${course.name}`}</h1>
        <p>{course.description}</p>
        <p>Rating: {course.rating ? course.rating.toFixed(1) : 'No rating yet'} / 5</p>
        <button
          className="add-review-button"
          onClick={() => setIsAddingReview(!isAddingReview)}
        >
          {isAddingReview ? '- Cancel Review' : '+ Add Review'}
        </button>
      </div>

      {isAddingReview && (
        <div className="add-review-section">
          <form onSubmit={handleSubmitReview} className="add-review-form">
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
        </div>
      )}

      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to add one!</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review._id} className="review-item">
                <p className="review-comment">"{review.comment}"</p>
                <p className="review-rating">Rating: {review.rating} / 5</p>
                <p className="review-user">
                  - {review.user ? review.user.username : 'Anonymous'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

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

export default CourseDetails;