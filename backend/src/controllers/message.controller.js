import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Room from "../models/room.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

// Fetch users for sidebar (excluding the logged-in user)
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch chat rooms
export const getRooms = async (req, res) => {
  try {
    const userId = req.user._id;
    const rooms = await Room.find({ users: userId })
      .select("-__v")                                       // Exclude Mongoose version key
      .lean();                                              // Optimize performance by returning plain objects

    console.log(`User ${userId} is in rooms:`, rooms);

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Create a new room
export const createRoom = async (req, res) => {
  const { roomName } = req.body;

  if (!roomName || roomName.trim() === "") {
    return res.status(400).json({ error: "Room name is required and cannot be empty" });
  }

  try {
    const existingRoom = await Room.findOne({ name: roomName });
    if (existingRoom) {
      return res.status(400).json({ error: "Room already exists" });
    }

    // Create new room
    const newRoom = await Room.create({
      name: roomName,
      users: [req.user._id],
    });

    return res.status(201).json({
      message: "Room created successfully",
      room: newRoom, // Return the created room details
    });
  } catch (error) {
    console.error("Error creating room:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Delete a room
export const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  console.log("Deleting room with ID:", roomId);
  try {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: "Invalid Room ID" });
    }

    const roomObjectId = new mongoose.Types.ObjectId(roomId);

    const room = await Room.findById(roomObjectId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Delete all messages associated with the room
    await Message.deleteMany({ roomId: room._id });

    // Delete the room itself
    await Room.findByIdAndDelete(roomId);

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch messages for a specific user or room
export const getMessages = async (req, res) => {
  try {
    const { id: chatId } = req.params;                    // Room ID or Contact ID
    const myId = req.user._id;

    let messages;

    if (req.query.room) {
      // Fetch messages for a room (group chat)
      messages = await Message.find({ roomId: chatId })
        .populate("senderId", "fullName profilePic")
        .sort({ createdAt: 1 })                           // Sort messages in order
        .lean();
    } else {
      // Fetch 1-to-1 messages
      messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: chatId },
          { senderId: chatId, receiverId: myId },
        ],
      })
        .populate("senderId", "fullName profilePic") // Populate sender details
        .populate("receiverId", "fullName profilePic") // Populate receiver details
        .sort({ createdAt: 1 }) // Sort messages in order
        .lean();
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send a message to a specific user or room
export const sendMessage = async (req, res) => {
  try {
    const { text, image, room } = req.body;     // Room is optional for group chat
    const { id: receiverId } = req.params;      // Receiver ID for 1-to-1 chat
    const senderId = req.user._id;

    let imageUrl = null;

    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ error: "Image upload failed", details: uploadError.message });
      }
    }

    const newMessageData = {
      senderId,
      text,
      image: imageUrl,
    };

    // Determine if it's a room message or 1-to-1 message
    if (room) {
      newMessageData.roomId = room;                 // Group chat
    } else {
      newMessageData.receiverId = receiverId;       // 1-to-1 chat
    }

    let newMessage = await Message.create(newMessageData);

    // Populate the sender details (fixing the missing profile picture issue)
    newMessage = await newMessage.populate("senderId", "fullName profilePic");

    // Emit the message with sender details
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    if (room) {
      io.to(room).emit("newMessage", newMessage);
    } else {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a contact to a room
export const addContactToRoom = async (req, res) => {
  const { roomId, userId } = req.body;

  if (!roomId || !userId) {
    return res.status(400).json({ error: "Room ID and user ID are required" });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Add the user to the room if they are not already a member
    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }

    // Notify the user being added to the room
    const io = req.app.get("io");                     // Get the Socket.IO instance
    io.to(userId).emit("roomAdded", roomId);        // Emit the room addition event

    res.status(200).json({ message: "Contact added to room successfully" });
  } catch (error) {
    console.error("Error adding contact to room:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Remove a contact from a room
export const removeContactFromRoom = async (req, res) => {
  const { roomId, userId } = req.body;

  if (!roomId || !userId) {
    return res.status(400).json({ error: "Room ID and user ID are required" });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Remove the user from the room's members list
    room.users = room.users.filter((member) => member.toString() !== userId);
    await room.save();

    // Notify the user being removed from the room
    const io = req.app.get("io"); // Get the Socket.IO instance
    io.to(userId).emit("roomRemoved", roomId); // Emit the room removal event

    res.status(200).json({ message: "Contact removed from room successfully" });
  } catch (error) {
    console.error("Error removing contact from room:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



