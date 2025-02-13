import { useState } from "react";
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Import Dark Mode Context

const MessageInput = ({ sendMessage, isConnected }) => {
    const [content, setContent] = useState("");
    const { isDarkMode } = useDarkMode(); // ✅ Get dark mode state

    const handleSend = () => {
        if (!isConnected) {
            console.warn("⚠️ Cannot send message, socket is not connected yet.");
            return;
        }

        if (content.trim()) {
            sendMessage(content);
            setContent("");
        }
    };

    return (
        <div className="flex space-x-2 mt-2">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`flex-1 p-2 border rounded-md transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"
                }`}
                placeholder="Type a message..."
            />
            <button
                onClick={handleSend}
                disabled={!isConnected || !content.trim()} // Disable when not connected
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                    isConnected
                        ? isDarkMode
                            ? "bg-blue-400 text-white hover:bg-blue-500"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-500 text-gray-300 cursor-not-allowed"
                }`}
            >
                Send
            </button>
        </div>
    );
};

export default MessageInput;


