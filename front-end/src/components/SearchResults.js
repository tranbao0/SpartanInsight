import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState({ professors: [], courses: [] });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Query parameter:', query); // Debugging line

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
        setResults(response.data);
      } catch (err) {
        setError('Failed to fetch search results.');
        console.error(err);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (error) {
    return <div className="search-results-error">{error}</div>;
  }

  return (
    <div className="search-results-container">
      <h1 className="search-results-header">Search Results for "{query}"</h1>
      
      <div className="results-section">
        <h2 className="section-header">Professors</h2>
        <div className="results-list">
          {results.professors.length === 0 ? (
            <p className="no-results">No professors found.</p>
          ) : (
            results.professors.map((professor) => (
              <button
                key={professor._id}
                className="result-button"
                onClick={() => navigate(`/professors/${professor._id}`)}
              >
                {professor.name}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="results-section">
        <h2 className="section-header">Courses</h2>
        <div className="results-list">
          {results.courses.length === 0 ? (
            <p className="no-results">No courses found.</p>
          ) : (
            results.courses.map((course) => (
              <button
                key={course._id}
                className="result-button"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                {course.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
