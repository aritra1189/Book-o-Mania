import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import API_BASE_URL from "../config";
const SocketContext = createContext(null); // ✅ Ensure it’s never undefined

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        console.error("⚠️ useSocket() called outside of SocketProvider!");
        return { socket: null, isConnected: false }; // ✅ Return default values instead of crashing
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(API_BASE_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
            console.log("✅ Connected to Socket.IO server:", newSocket.id);
            setIsConnected(true);
            setSocket(newSocket);
        });

        newSocket.on("disconnect", (reason) => {
            console.warn(`⚠️ Socket disconnected: ${reason}`);
            setIsConnected(false);
        });

        return () => {
            newSocket.disconnect();
            console.log("🔻 Socket disconnected");
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
