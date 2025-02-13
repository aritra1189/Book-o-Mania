import {Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Import Dark Mode Context
import API_BASE_URL from "../config";
const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/book/search?id=${bookId}`);
      setBook(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Failed to load book details.");
      setLoading(false);
    }
  };

  // ✅ Handle Like
  const handleLike = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/book/search/like`,
        { bookId },
        { withCredentials: true }
      );
      fetchBookDetails();
    } catch (err) {
      console.error("Error liking book:", err);
      alert("Failed to like the book. Please try again.");
    }
  };

  // ✅ Handle Dislike
  const handleDislike = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/book/search/dislike`,
        { bookId },
        { withCredentials: true }
      );
      fetchBookDetails();
    } catch (err) {
      console.error("Error disliking book:", err);
      alert("Failed to dislike the book. Please try again.");
    }
  };

  // ✅ Handle Add Review
  const handleReviewSubmit = async () => {
    if (!comment.trim()) return alert("Comment cannot be empty.");

    try {
      await axios.post(
        `${API_BASE_URL}/api/book/search/review`,
        { bookId, comment },
        { withCredentials: true }
      );

      setComment("");
      fetchBookDetails();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg animate-pulse">Loading book details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className={`min-h-screen p-10 transition-all duration-300 flex flex-col items-center ${
      isDarkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-r from-blue-50 to-white text-gray-900'
    }`}>

      {/* Book Details Card */}
      <div className={`max-w-5xl w-full shadow-2xl rounded-3xl p-12 flex flex-col md:flex-row items-center md:items-start 
        backdrop-blur-md bg-opacity-80 border border-opacity-30 transform hover:scale-105 transition-all ${
          isDarkMode ? 'bg-gray-800 text-white border-gray-600 shadow-gray-900' : 'bg-white text-gray-900 border-gray-300 shadow-lg'
        }`}>

        {/* Left Side: Book Image & Name */}
        <div className="md:w-1/2 w-full flex flex-col items-center md:items-start">
          {book?.bookPicture && (
            <img
              src={book.bookPicture}
              alt={book.name}
              className="w-80 h-96 object-cover rounded-xl shadow-2xl mb-6 transform transition-transform hover:scale-110"
            />
          )}
          <h2 className="text-4xl font-extrabold text-center md:text-left">
            {book.name}
          </h2>

          {/* Like & Dislike Buttons */}
          <div className="mt-6 flex gap-4">
            <button 
            onClick={handleLike} 
             className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-xl transition-all flex items-center gap-2"
             >
            <span className="text-lg transition-transform duration-200 hover:scale-200">👍</span> 
          {book.likesCount}
            </button>

           <button 
           onClick={handleDislike} 
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-xl transition-all flex items-center gap-2"
            >
            <span className="text-lg transition-transform duration-200 hover:scale-200">👎</span> 
           {book.dislikesCount}
         </button>
          </div>
          {/* Liked & Disliked By */}
          <p className="mt-4 text-sm italic">
            <strong>Liked By:</strong> {book.likedBy.length > 0 ? book.likedBy.join(", ") : "No likes yet"}
          </p>
          <p className="text-sm italic">
            <strong>Disliked By:</strong> {book.dislikedBy.length > 0 ? book.dislikedBy.join(", ") : "No dislikes yet"}
          </p>
        </div>

        {/* Right Side: Book Details */}
        <div className="md:w-1/2 w-full space-y-6">
          <p className="text-lg"><strong>Author:</strong> {book.author}</p>
          <p className="text-lg"><strong>Genre:</strong> {book.genre}</p>
          <p className="text-lg"><strong>Published Date:</strong> {new Date(book.postdate).toDateString()}</p>
          <p className="text-lg leading-relaxed">
            <strong>Description:</strong> {book.description}
          </p>

          {/* Add Review (Text Area) */}
          <div className="mt-6">
            <textarea
              className="w-full border p-3 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Write a review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {/* Submit Review Button */}
             {/* Submit Review Button with New Gradient */}
           <button 
             className="bg-gradient-to-r mt-3 from-pink-500 to-purple-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
             onClick={handleReviewSubmit}
            >
           ✅ Submit Review
           </button>

{/* Join Discussion Room Button (Placed Below) */}
          <div className="mt-8 justify-center">
          <Link 
            to={`/chat/${bookId}`} 
            className="inline-block text-center bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all"
             >
           💬 Join Discussion Room
          </Link>
           </div>
           </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className={`max-w-5xl w-full mt-12 p-10 shadow-2xl rounded-3xl border border-opacity-30 transform hover:scale-105 transition-all ${
        isDarkMode ? 'bg-gray-800 text-white border-gray-600 shadow-gray-900' : 'bg-white text-gray-900 border-gray-300 shadow-lg'
      }`}>
        <h2 className="text-3xl font-semibold mb-6">Reviews</h2>
        <ul className="space-y-6">
          {book?.reviews.length > 0 ? (
            book.reviews.map((review, index) => (
              <li key={index} className="border-b pb-3">
                <strong>{review.user?.name}:</strong> {review.comment}
              </li>
            ))
          ) : (
            <p className="text-lg text-gray-400 italic">No reviews yet. Be the first to review!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BookDetails;





