import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProfessorList from '../components/ProfessorList';

const LoggedInHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the query parameter for "view"
  const queryParams = new URLSearchParams(location.search);
  const initialView = queryParams.get('view') || 'professors'; // Default to "professors"

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(initialView); // Set initial view from query param
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized: Please log in to view data.');
        }

        const coursesRes = await axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourses(coursesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses.');
      }
    };

    if (activeView === 'courses') {
      fetchCourses();
    }
  }, [activeView]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderList = () => {
    if (activeView === 'professors') {
      return (
        <>
          <ProfessorList />
          <div className="create-professor-link">
            <button
              className="tiny-link"
              onClick={() => navigate('/create-professor')}
            >
              + Add Professor
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h2>Courses</h2>
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course._id} className="course-item">
                <h3 className="course-title">
                  {`${course.prefix || 'N/A'} ${course.number || '000'} - ${course.name || 'Unnamed Course'}`}
                </h3>
                <div className="course-description">
                  {course.description || 'No description available.'}
                </div>
              </div>
            ))
          ) : (
            <p>No courses available.</p>
          )}
          <div className="create-professor-link">
            <button
              className="tiny-link"
              onClick={() => navigate('/create-course')}
            >
              + Add Course
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div>
      <header>
        <button onClick={toggleSidebar}>&#9776;</button>
        <h1>Welcome Back</h1>
      </header>

      {isSidebarOpen && (
        <aside>
          <button onClick={logout}>Logout</button>
        </aside>
      )}

      <main>
        <div className="toggle-buttons">
          <button
            onClick={() => setActiveView('professors')}
            className={activeView === 'professors' ? 'active' : ''}
          >
            View Professors
          </button>
          <button
            onClick={() => setActiveView('courses')}
            className={activeView === 'courses' ? 'active' : ''}
          >
            View Courses
          </button>
        </div>

        <div className="list-container">{renderList()}</div>
        {error && <p className="error-message">{error}</p>}
      </main>
    </div>
  );
};

export default LoggedInHomePage;
