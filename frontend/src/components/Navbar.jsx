import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Dark Mode Context
import avatar from "../assets/react.svg"; // ✅ Default avatar image
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config";
import { LibraryBig} from 'lucide-react';
const Navbar = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ✅ Profile dropdown state
  const [isAuthor, setIsAuthor] = useState(false); // ✅ Toggle for Author/Reader mode

  // Fetch search results
  const fetchSearchResults = async () => {
    if (searchQuery.length > 1) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/book/search?query=${searchQuery}`);
        setSearchResults(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error searching books:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className={`fixed top-0 w-full max-h-5px z-10 transition-all duration-300 shadow-lg ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex justify-between h-20 items-center">
      <LibraryBig size={64} color="#610ab8" strokeWidth={2} absoluteStrokeWidth />
        {/* 🔹 Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-400 transition">
          Book-o-Mania
        </Link>

        {/* 🔹 Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-400 transition">Home</Link>
          <Link to="/books" className="hover:text-gray-400 transition">Books</Link>
        </div>

        {/* 🔹 Search Bar, Register & Profile */}
        <div className="flex items-center space-x-4 relative">
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search books..."
              className={`pl-10 pr-4 py-2 w-64 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
            />
            <svg
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-12 left-0 w-64  bg-white border rounded-md shadow-lg z-50">
                {searchResults.map((book) => (
                  <Link
                    key={book._id}
                    to={`/book/${book._id}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    {book.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={fetchSearchResults}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md text-sm font-medium transition"
          >
            Search
          </button>

          {/* 🔄 Toggle Role: Reader / Author */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{isAuthor ? "Author" : "Reader"}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAuthor}
                onChange={() => setIsAuthor(!isAuthor)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-blue-500 peer-checked:border-blue-700 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>

          {/* Register Book Button (Only Visible to Authors) */}
          {isAuthor && (
            <Link to="/register-book">
              <button className="bg-green-500 hover:bg-green-600  bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                Register Book
              </button>
            </Link>
          )}

          {/* Profile Avatar with Dropdown */}
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden">
              <img src={user?.profilePicture || avatar} alt="Profile" className="w-full h-full object-cover" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Profile
                </Link>
                <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Sign Up
                </Link>
                <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-blue-500"} hover:${isDarkMode ? "bg-gray-600" : "bg-blue-600"} transition`}
          >
            {isDarkMode ? (
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            ) : (
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;






