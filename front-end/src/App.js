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
import PublicListingsPage from "./pages/PublicListingsPage";
import LoggedInListingsPage from "./pages/LoggedInListingsPage";
import SearchResults from "./components/SearchResults";

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

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<PublicListingsPage />} />
        <Route path="/professors/:id" element={<ProfessorDetails isPublic={true} />} />
        <Route path="/courses/:id" element={<CourseDetails isPublic={true} />} />
        <Route 
          path="/login" 
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/signup" 
          element={<SignUpPage />} 
        />
        <Route path="/search" element={<SearchResults />} />

        {/* Protected routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <LoggedInHomePage setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        
        <Route 
          path="/home/listings" 
          element={
            <ProtectedRoute>
              <LoggedInListingsPage setIsLoggedIn={setIsLoggedIn} />
            </ProtectedRoute>
          }
        />
        
        {/* Professor routes */}
        <Route 
          path="/professors" 
          element={
            <ProtectedRoute>
              <ProfessorList />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/create-professor" 
          element={
            <ProtectedRoute>
              <CreateProfessor />
            </ProtectedRoute>
          }
        />

        {/* Course routes */}
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/create-course" 
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;