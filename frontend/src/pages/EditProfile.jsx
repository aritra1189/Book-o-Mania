import { useState } from "react";
import { useDarkMode } from "../context/Darkmodecontext"; // Import Dark Mode Context
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../config";
const Profile = () => {
   const navigate = useNavigate(); 
  const { user,setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [dateofBirth, setDateofBirth] = useState(user?.dateofBirth || "");
  const [city, setCity] = useState(user?.city || "");
  const [username, setUsername] = useState(user?.username || "");
  const [country, setCountry] = useState(user?.country || "");
  const { isDarkMode } = useDarkMode(); // ✅ Get Dark Mode State

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const updateUserProfile = async (name, dateofBirth, city, username, country) => {
    setLoading(true); // ✅ Start loading state
    setSuccessMessage(""); // Clear success message

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "PUT",
        credentials: "include", // Send HTTP-only cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, dateofBirth, city, username, country }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      console.log("Profile updated:", updatedUser);
      setUser(updatedUser); // ✅ Update user context state
      setSuccessMessage("Profile updated successfully! 🎉");

      // Reset button state after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setLoading(false);
      }, 1000);
      navigate('/profile');
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(name, dateofBirth, city, username, country);
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-900"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-2xl shadow-2xl w-[400px] space-y-6 transition-all duration-300 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 className="text-2xl font-bold text-center">Update Profile</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="text-green-500 font-semibold text-center">{successMessage}</div>
        )}

        {/* Name Input */}
        <div>
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Date of Birth Input */}
        <div>
          <label className="block font-semibold">Date of Birth:</label>
          <input
            type="date"
            value={dateofBirth}
            onChange={(e) => setDateofBirth(e.target.value)}
            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* City Input */}
        <div>
          <label className="block font-semibold">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Username Input */}
        <div>
          <label className="block font-semibold">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Country Input */}
        <div>
          <label className="block font-semibold">Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                : "bg-gray-100 border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Submit Button with Loading & Success States */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-2 rounded-lg transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Updating..." : successMessage ? "Profile Updated ✅" : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;














