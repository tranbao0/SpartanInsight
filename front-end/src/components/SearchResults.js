import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState({ professors: [], courses: [] });
  const [error, setError] = useState('');

  useEffect(() => {
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
    <div className="search-results">
      <h1>Search Results for "{query}"</h1>
      <div className="results-section">
        <h2>Professors</h2>
        {results.professors.length === 0 ? (
          <p>No professors found.</p>
        ) : (
          <ul>
            {results.professors.map((professor) => (
              <li key={professor._id}>
                <a href={`/professors/${professor._id}`}>{professor.name}</a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="results-section">
        <h2>Courses</h2>
        {results.courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <ul>
            {results.courses.map((course) => (
              <li key={course._id}>
                <a href={`/courses/${course._id}`}>{course.name}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
