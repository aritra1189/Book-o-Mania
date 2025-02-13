import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Import Dark Mode Context
import { Link } from "react-router-dom"; // Import Link from React Router
function Profile() {
  const { user, loading } = useAuth(); // ✅ Get user & loading state from AuthContext
  const { isDarkMode } = useDarkMode(); // ✅ Get dark mode state

  if (loading) return <h2 className="text-center text-lg font-semibold animate-pulse">Loading...</h2>;
  if (!user) return <h2 className="text-red-500 text-center text-lg">You are not logged in.</h2>;

  return (
    <div className={`flex justify-center items-center min-h-screen transition-all duration-300 ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white" : "bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200 text-gray-900"}`}>
      <div className={`p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center w-[850px] space-x-10 backdrop-blur-2xl bg-opacity-80 border border-gray-300 transition-all duration-300 ${isDarkMode ? "bg-gray-800/70 text-white border-gray-600" : "bg-white/70 text-gray-900 border-gray-300"}`}>
        
        {/* Profile Picture */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <img 
            src={user.profilePicture || "https://via.placeholder.com/150"} 
            alt="Profile" 
            className="w-full h-full rounded-full border-4 object-cover border-gray-400 shadow-2xl hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute bottom-3 right-3 bg-green-500 w-7 h-7 rounded-full border-2 border-white animate-ping"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-5xl font-extrabold tracking-wide bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">Welcome, {user.username}!</h1>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-lg font-medium">
            <p><strong className="text-blue-400">Email:</strong> {user.email}</p>
            <p><strong className="text-green-400">Name:</strong> {user.name}</p>
            <p><strong className="text-pink-400">DOB:</strong> {new Date(user.dateofBirth).toDateString()}</p>
            <p><strong className="text-purple-400">Country:</strong> {user.country}</p>
            <p><strong className="text-yellow-400">City:</strong> {user.city}</p>
          </div>
          <Link to="/editprofile">
              <button className="mt-6 px-8 py-3 text-xl font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl hover:scale-105 hover:bg-blue-600 transition-all duration-300">
                  Edit Profile
             </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;







