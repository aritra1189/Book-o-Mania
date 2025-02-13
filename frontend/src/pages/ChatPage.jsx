import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatRoom from "../components/ChatRoom";
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Import Dark Mode Context
import axios from "axios";
import API_BASE_URL from "../config";
const ChatPage = () => {
    const { bookId } = useParams();
    const { isDarkMode } = useDarkMode(); // ✅ Get dark mode state
    const [bookName, setBookName] = useState("Loading...");

    // ✅ Fetch book name based on bookId
    useEffect(() => {
        const fetchBookName = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/book/search?id=${bookId}`);
                setBookName(res.data.name); // ✅ Set book title
            } catch (error) {
                console.error("❌ Error fetching book name:", error);
                setBookName("Unknown Book");
            }
        };

        fetchBookName();
    }, [bookId]);

    return (
        <div
            className={`flex flex-col h-screen p-4 transition-colors duration-300 ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
            }`}
        >
            <h2 className="text-2xl font-semibold mb-4">
                📚 {bookName} Discussion Room
            </h2>
            <ChatRoom bookId={bookId} />
        </div>
    );
};

export default ChatPage;
