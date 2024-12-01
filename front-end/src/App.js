import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProfessorList from "./components/ProfessorList";
import ProfessorDetails from "./components/ProfessorDetails";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import CreateProfessor from "./pages/CreateProfessor";
import LoggedInHomePage from "./pages/LoggedInHomePage";
import CreateCourse from "./pages/CreateCourse";
import CourseList from "./components/CourseList";
import CourseDetails from "./components/CourseDetails";
import ListingsPage from "./pages/ListingsPage";

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
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/professors/:id" element={<ProfessorDetails isPublic={true} />} />
        <Route path="/courses/:id" element={<CourseDetails isPublic={true} />} />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/home" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/signup" 
          element={isLoggedIn ? <Navigate to="/home" /> : <SignUpPage />} 
        />

        {/* Private routes */}
        <Route 
          path="/home" 
          element={isLoggedIn ? <LoggedInHomePage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} 
        />
        
        {/* Professor routes */}
        <Route 
          path="/professors" 
          element={isLoggedIn ? <ProfessorList /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create-professor" 
          element={isLoggedIn ? <CreateProfessor /> : <Navigate to="/login" />} 
        />

        {/* Course routes */}
        <Route 
          path="/courses" 
          element={isLoggedIn ? <CourseList /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create-course" 
          element={isLoggedIn ? <CreateCourse /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;