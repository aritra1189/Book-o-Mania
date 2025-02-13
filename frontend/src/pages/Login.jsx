import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Import Dark Mode Context
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
const LoginForm = () => {
  const { isDarkMode } = useDarkMode(); // ✅ Get dark mode state
  const { setUser } = useAuth(); // ✅ Get setUser from AuthContext
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData, {
        withCredentials: true, // ✅ Ensure cookies are stored
      });

      console.log("Login successful:", response.data);
      alert("Logged in successfully");

      // ✅ Automatically set user after successful login
      setUser(response.data.user);

      // ✅ Redirect to Profile Page
      navigate("/profile");

    } catch (err) {
      console.error("Login error:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className={`p-8 rounded-lg shadow-md w-96 transition-all duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <div className={`px-4 py-3 rounded mb-4 ${isDarkMode ? "bg-red-700 text-white" : "bg-red-100 border border-red-400 text-red-700"}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className={`block font-bold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ${isDarkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-400" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"}`}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className={`block font-bold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ${isDarkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-400" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"}`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""} ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;


