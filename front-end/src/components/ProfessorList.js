import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfessorList.css';

const ProfessorList = () => {
  const [professors, setProfessors] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/professors');
        setProfessors(response.data);
      } catch (err) {
        setError('Failed to fetch professors.');
        console.error(err);
      }
    };

    fetchProfessors();
  }, []);

  if (error) {
    return <div className="professor-list-error">{error}</div>;
  }

  return (
    <div className="professor-list">
      <h1 className="professor-list-header">Professors</h1>
      <div className="professor-list-container">
        {professors.map((professor) => (
          <button
            key={professor._id}
            className="professor-button"
            onClick={() => navigate(`/professors/${professor._id}`)}
          >
            {professor.name}
          </button>
        ))}
        
      </div>
      <div className="create-professor-link">
        <button className="tiny-link" onClick={() => navigate('/create-professor')}>
          + Add Professor
        </button>
      </div>
    </div>
  );
};

export default ProfessorList;
