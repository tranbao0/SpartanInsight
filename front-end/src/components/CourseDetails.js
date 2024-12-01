import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseDetails.css';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).id;
  } catch (error) {
    return null;
  }
};

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const [isAddingReview, setIsAddingReview] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${id}/reviews`);
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
        {isLoggedIn && (
          <button
            className="add-review-button"
            onClick={() => setIsAddingReview(!isAddingReview)}
          >
            {isAddingReview ? '- Cancel Review' : '+ Add Review'}
          </button>
        )}
      </div>

      {isLoggedIn && isAddingReview && (
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
          <p>No reviews yet. {isLoggedIn ? 'Be the first to add one!' : 'Log in to add the first review!'}</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review._id} className="review-item">
                <p className="review-comment">"{review.comment}"</p>
                <p className="review-rating">Rating: {review.rating} / 5</p>
                <p className="review-user">
                  {review.user && review.user._id === getUserIdFromToken() 
                    ? '- You'
                    : '- Anonymous'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="back-button-container">
        <button
          className="back-button"
          onClick={() => navigate(isLoggedIn ? '/home' : '/listings')}
        >
          Back to {isLoggedIn ? 'Home' : 'Listings'}
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;