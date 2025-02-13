const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const profileroutes = require('./routes/Profileorutes.js');
const bookroutes = require('./routes/bookroutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const connectdb = require('./database/index.js');
const { Server } = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
const server = http.createServer(app);
connectdb();
app.get('/',(req,res)=>{
  res.send("hello from aritra")
});
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://book-o-mania.vercel.app", // ✅ Frontend URL (Update if needed)
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT"],
  })
);

// ✅ Define routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileroutes);
app.use('/api/book', bookroutes);
app.use('/api/chat', chatRoutes);

// ✅ Ensure OPTIONS method is handled correctly
app.options("*", cors());

// ✅ Initialize Socket.IO

const io = new Server(server, {
  cors: {
    origin: "https://book-o-mania.vercel.app",
    credentials: true,
  },
  transports: ["websocket", "polling"], // ✅ Ensures WebSockets work
});

io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on("joinRoom", (bookId) => {
        if (!bookId) {
            console.error(`⚠️ Invalid bookId received from ${socket.id}`);
            return;
        }
        console.log(`📥 Received joinRoom event for bookId: ${bookId}`);
        socket.join(bookId);
        io.to(bookId).emit("userJoined", { userId: socket.id, message: "A user joined the chat" });
        console.log(`📢 User ${socket.id} joined room: ${bookId}`);
    });

    socket.on("sendMessage", (data) => {
        if (!data.bookId || !data.content) {
            console.error(`⚠️ Invalid message data received from ${socket.id}`);
            return;
        }

        io.to(data.bookId).emit("receiveMessage", data);
        console.log(`📩 Message sent to room ${data.bookId}: ${data.content}`);
    });

    socket.on("disconnect", (reason) => {
        console.log(`❌ User disconnected: ${socket.id}, Reason: ${reason}`);
    });

    socket.on("connect_error", (err) => {
        console.error(`❌ Socket.IO connection error:`, err);
    });
});

server.listen(5050, () => console.log("🚀 Server running on port 5050"));



