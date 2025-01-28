import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Attach Socket.IO instance to app
app.set("io", io); // Makes it available in controllers

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO Logic
const onlineUsers = new Map(); // Map to track online users (userId -> socketId)

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Add user to the onlineUsers map
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id); // Map userId to socket ID
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys())); // Emit the updated online users
    console.log("Online Users:", Array.from(onlineUsers.keys()));
  });

  // Join a specific chat room
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User with socket ID ${socket.id} joined room: ${room}`);
  });

  // Handle user typing event
  socket.on("typing", ({ roomId, userId }) => {
    if (roomId) {
      socket.to(roomId).emit("userTyping", userId); // Broadcast typing event to room
    }
  });

  // Handle user stop typing event
  socket.on("stopTyping", ({ roomId }) => {
    if (roomId) {
      socket.to(roomId).emit("userStopTyping"); // Broadcast stop typing event to room
    }
  });

  // Handle new messages
  socket.on("sendMessage", (message) => {
    const { room, receiverId } = message;

    if (room) {
      // Broadcast the message to the room
      io.to(room).emit("newMessage", message);
    } else {
      // Send the message to a specific user
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      }
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    // Remove user from the onlineUsers map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys())); // Emit updated online users
    console.log("User disconnected:", socket.id);
  });
});


if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));


  app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Database Connection
  // connectDB()
  // .then(() => {
  //   console.log("Database connected successfully!");
  // })
  // .catch((error) => {
  //   console.error("Database connection error:", error.message);
  // });

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
