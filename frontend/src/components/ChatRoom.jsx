import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useDarkMode } from "../context/Darkmodecontext"; // ✅ Import Dark Mode Context
import axios from "axios";
import API_BASE_URL from "../config";

const ChatRoom = () => {
    const { bookId } = useParams();
    const { socket, isConnected } = useSocket();
    const { isDarkMode } = useDarkMode(); // ✅ Get dark mode state
    const [messages, setMessages] = useState([]);

    // ✅ Ensure socket is available before rendering
    if (!socket) {
        console.error("⚠️ ChatRoom: Socket is not available! Is SocketProvider wrapping the app?");
        return <p className="text-red-500">⚠️ Error: WebSocket not available.</p>;
    }

    useEffect(() => {
        if (!socket || !isConnected) return;

        console.log(`🔹 Joining room: ${bookId} with Socket ID: ${socket.id}`);
        socket.emit("joinRoom", bookId);

        const fetchMessages = async () => {
            try {
                console.log(`📥 Fetching messages for bookId: ${bookId}`);
                const res = await axios.get(`${API_BASE_URL}/api/chat/messages/${bookId}`, { withCredentials: true });

                console.log("📩 Received messages from API:", res.data);
                setMessages(res.data);
            } catch (error) {
                console.error("❌ Error fetching messages:", error);
            }
        };

        fetchMessages();

        const handleReceiveMessage = (message) => {
            console.log(`📩 New message received:`, message);
            setMessages((prev) => [...prev, message]);
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            console.log(`🔻 Leaving room: ${bookId}`);
            socket.emit("leaveRoom", bookId);
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket, isConnected, bookId]);

    // ✅ Send message and update UI instantly
    const sendMessage = async (content) => {
        if (!isConnected) {
            console.error("⚠️ Cannot send message, socket is not connected yet.");
            return;
        }
        if (!bookId) {
            console.error("⚠️ Invalid bookId, cannot send message.");
            return;
        }

        try {
            const messageData = { bookId, content };

            // ✅ Send message to backend and get the updated message with user name
            const res = await axios.post(`${API_BASE_URL}/api/chat/send`, messageData, { withCredentials: true });
            const savedMessage = res.data.data; // Ensure response includes populated userId

            console.log("✅ Message saved:", savedMessage);

            // ✅ Emit real-time event to other users
            socket.emit("sendMessage", savedMessage);

            // ✅ Update local state immediately
            setMessages((prev) => [...prev, savedMessage]);
        } catch (error) {
            console.error("❌ Error sending message:", error);
        }
    };

    return (
        <div className={`flex flex-col h-full p-4 rounded-lg transition-colors duration-300 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}>
            <MessageList messages={messages} />
            <MessageInput sendMessage={sendMessage} isConnected={isConnected} />
            {!isConnected && <p className="text-red-500">⚠️ Connecting to chat...</p>}
        </div>
    );
};

export default ChatRoom;







