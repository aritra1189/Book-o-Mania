import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Import Dark Mode Context
import API_BASE_URL from "../config";
const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isDarkMode } = useDarkMode(); // ✅ Use global dark mode

  useEffect(() => {
    // Fetch all books from API
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/book/all`);
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading books...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className={`min-h-screen max-w-12xl p-10 transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            className={`shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col items-center ${
              isDarkMode ? "bg-gray-800 border border-gray-700 text-white" : "bg-white border border-gray-300 text-gray-900"
            }`}
          >
            <div className="w-40 h-60 overflow-hidden rounded-md shadow-md border-2">
              <img
                src={book.bookPicture}
                alt={book.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-bold text-center mt-3">{book.name}</h2>
            <p className="text-sm mt-1">
              <strong>Author:</strong> {book.author}
            </p>

            <Link
              to={`/book/${book._id}`}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:scale-105 transition-all"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;


