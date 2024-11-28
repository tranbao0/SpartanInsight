import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProfessorList from "./components/ProfessorList";
import ProfessorDetails from "./components/ProfessorDetails";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import CreateProfessor from './pages/CreateProfessor';
import AddReview from './pages/AddReview';
import LoggedInHomePage from "./pages/LoggedInHomePage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <SignUpPage />} />

        {/* private routes */}
        <Route path="/home" element={isLoggedIn ? <LoggedInHomePage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} />
        <Route path="/professors" element={isLoggedIn ? <ProfessorList /> : <Navigate to="/login" />} />
        <Route path="/professors/:id" element={isLoggedIn ? <ProfessorDetails /> : <Navigate to="/login" />} />
        <Route path="/create-professor" element={isLoggedIn ? <CreateProfessor /> : <Navigate to="/login" />} />
        <Route path="/professors/:id/add-review" element={isLoggedIn ? <AddReview /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
