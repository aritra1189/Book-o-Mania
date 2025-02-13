import { useAuth } from "../context/AuthContext";

const Message = ({ message, currentUser }) => {
    const isOwnMessage = currentUser?._id === message.userId?._id || currentUser?.id === message.userId;
    const { user } = useAuth();
    
    // ✅ Ensure user name is correctly populated
    const senderName = message.userId?.name || "Unknown User";

    // ✅ Ensure timestamp is correctly formatted
    const formattedTime = message.timestamp 
        ? new Date(message.timestamp).toLocaleTimeString() 
        : "Time Unavailable";

    return (
      <div className={`flex items-center space-x-2 p-2 border-b ${isOwnMessage ? "justify-end" : "justify-start"}`}>
        {!isOwnMessage && <strong>{senderName}</strong>}
        <p className="bg-gray-200 p-2 rounded-lg">{message.content}</p>
        {isOwnMessage && <span className="text-xs text-gray-500">You</span>}
        <span className="text-xs text-gray-400 ml-2">{formattedTime}</span>
      </div>
    );
};

export default Message;

  