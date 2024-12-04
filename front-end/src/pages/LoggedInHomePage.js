import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoggedInHomePage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialView = queryParams.get('view') || 'professors';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(initialView);
  const [professors, setProfessors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized: Please log in to view data.');
        }

        const professorsRes = await axios.get('http://localhost:5000/api/professors', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfessors(professorsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch professors.');
      }
    };

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

    if (activeView === 'professors') {
      fetchProfessors();
    } else if (activeView === 'courses') {
      fetchCourses();
    }
  }, [activeView]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      sessionStorage.clear();
      setIsLoggedIn(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/', { replace: true });
    }
  };

  const renderProfessors = () => {
    return professors.length > 0 ? (
      professors.map((professor) => (
        <div key={professor._id} className="professor-item">
          <div className="professor-details">
            <p className="professor-name">{professor.name}</p>
            <p className="professor-department">Department: {professor.department}</p>
          </div>
          <button
            className="add-review-button"
            onClick={() => navigate(`/professors/${professor._id}`)}
          >
            View/Add Review
          </button>
        </div>
      ))
    ) : (
      <p>No professors available.</p>
    );
  };

  const renderCourses = () => {
    return courses.length > 0 ? (
      courses.map((course) => (
        <div key={course._id} className="course-item">
          <div className="course-details">
            <h3 className="course-title">
              {`${course.prefix || 'N/A'} ${course.number || '000'} - ${course.name || 'Unnamed Course'}`}
            </h3>
            <p className="course-description">{course.description || 'No description available.'}</p>
          </div>
          <button
            className="add-review-button"
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            View/Add Review
          </button>
        </div>
      ))
    ) : (
      <p>No courses available.</p>
    );
  };

  const renderList = () => {
    if (activeView === 'professors') {
      return (
        <>
          <h2>Professors</h2>
          <div className="list-container">{renderProfessors()}</div>
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
          <div className="list-container">{renderCourses()}</div>
          <div className="create-course-link">
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
        <div className="search-container">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Course or Professor"
            aria-label="search"
            className="search-input"
          />
        </div>

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

        {error && <p className="error-message">{error}</p>}
        {renderList()}
      </main>
    </div>
  );
};

export default LoggedInHomePage;