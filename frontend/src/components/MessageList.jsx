import { useDarkMode } from "../context/Darkmodecontext";

const MessageList = ({ messages }) => {
    const { isDarkMode } = useDarkMode(); // ✅ Get dark mode state

    return (
        <div
            className={`flex flex-col space-y-2 p-2 rounded-lg overflow-y-auto h-80 transition-colors duration-300 ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
        >
            {messages.map((msg, index) => {
                const username = msg.userId?.name || "Unknown User"; // ✅ Handle missing name
                const formattedTime = msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString()
                    : "Time Unavailable"; // ✅ Handle invalid timestamp

                return (
                    <div
                        key={index}
                        className={`p-2 border rounded-md ${
                            isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                    >
                        <strong>{username}:</strong> {msg.content}
                        <span className={`text-xs block ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {formattedTime}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default MessageList;

