import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeProvider, useDarkMode } from "./context/Darkmodecontext"; // ✅ Dark Mode Context
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ Auth Context
import { SocketProvider } from "./context/SocketContext"; // ✅ Socket Context
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import LoginForm from "./pages/Login";
import EditProfile from "./pages/EditProfile";
import RegisterBook from "./pages/Bookregister";
import BookDetails from "./pages/BookDetails";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Protect pages that require login
import Allbooks from "./components/Allbooks";
import ChatPage from "./pages/ChatPage";

const AppContent = () => {
  const { isDarkMode } = useDarkMode(); // ✅ Access dark mode
  const { loading } = useAuth(); // ✅ Access user authentication state

  if (loading) {
    return <h2 className="text-center text-xl mt-10">Loading...</h2>;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} transition-colors duration-300`}>
      <Navbar />
      <div className="mt-20 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/books" element={<Allbooks />} />

          {/* 🔐 Protected Routes - Only Logged-In Users Can Access */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/register-book" element={<ProtectedRoute><RegisterBook /></ProtectedRoute>} />
          <Route path="/book/:bookId" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />

          {/* 🔥 Chat Page - Accessible by Authenticated Users */}
          <Route path="/chat/:bookId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider> {/* ✅ Wrap inside AuthProvider to manage authentication */}
      <DarkModeProvider> {/* ✅ Dark mode context for theme switching */}
        <SocketProvider> {/* ✅ Now correctly wraps AppContent */}
          <Router>
            <AppContent />
          </Router>
        </SocketProvider>
      </DarkModeProvider>
    </AuthProvider>
  );
};

export default App;



