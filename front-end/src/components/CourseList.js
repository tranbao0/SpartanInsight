import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses.');
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  if (error) {
    return <div className="course-list-error">{error}</div>;
  }

  return (
    <div className="course-list">
      <h1 className="course-list-header">Courses</h1>
      <div className="course-list-container">
        {courses.map((course) => (
          <button
            key={course._id}
            className="course-button"
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            {`${course.prefix} ${course.number} - ${course.name}`}
          </button>
        ))}
      </div>
      <div className="create-course-link">
        <button className="tiny-link" onClick={() => navigate('/create-course')}>
          + Add Course
        </button>
      </div>
    </div>
  );
};

export default CourseList;