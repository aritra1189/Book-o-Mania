import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Import Dark Mode Context
import { Link } from "react-router-dom"; // Import Link from React Router

function Profile() {
  const { user, loading } = useAuth(); // ✅ Get user & loading state from AuthContext
  const { isDarkMode } = useDarkMode(); // ✅ Get dark mode state

  if (loading) return <h2 className="text-center text-lg font-semibold animate-pulse">Loading...</h2>;
  if (!user) return <h2 className="text-red-500 text-center text-lg">You are not logged in.</h2>;

  return (
    <div className={`flex justify-center items-center min-h-screen p-4 transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-blue-100 text-gray-900"}`}>
      <div className={`p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center w-full max-w-3xl space-y-6 md:space-y-0 md:space-x-10 backdrop-blur-2xl bg-opacity-80 border border-gray-300 transition-all duration-300 ${isDarkMode ? "bg-gray-800/70 border-gray-600" : "bg-white/70 border-gray-300"}`}>
        
        {/* Profile Picture */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0">
          <img 
            src={user.profilePicture || "https://via.placeholder.com/150"} 
            alt="Profile" 
            className="w-full h-full rounded-full border-4 object-cover border-gray-400 shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-3 right-3 bg-green-500 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white animate-ping"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
            Welcome, {user.username}!
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-lg font-medium">
            <p><strong className="text-blue-400">Email:</strong> {user.email}</p>
            <p><strong className="text-green-400">Name:</strong> {user.name}</p>
            <p><strong className="text-pink-400">DOB:</strong> {new Date(user.dateofBirth).toDateString()}</p>
            <p><strong className="text-purple-400">Country:</strong> {user.country}</p>
            <p><strong className="text-yellow-400">City:</strong> {user.city}</p>
          </div>
          <Link to="/editprofile">
            <button className="mt-4 px-6 py-2 sm:px-8 sm:py-3 text-lg sm:text-xl font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-105 transition-all duration-300">
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;







