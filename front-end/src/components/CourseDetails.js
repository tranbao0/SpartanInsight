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

  useEffect(() => {
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

    fetchCourseDetails();
  }, [id]);

  if (error) {
    return <div className="course-details-error">{error}</div>;
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-details">
      <div className="course-header">
        <h1>{course.name}</h1>
        <p>Rating: {course.rating ? course.rating.toFixed(1) : 'No rating yet'} / 5</p>
        <button
          className="add-review-button"
          onClick={() => navigate(`/courses/${id}/add-review`)}
        >
          + Add Review
        </button>
      </div>

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

    </div>
  );
};

export default CourseDetails;
