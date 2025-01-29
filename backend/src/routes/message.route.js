import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  getRooms,
  createRoom,
  deleteRoom,
  addContactToRoom,
  removeContactFromRoom,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/rooms", protectRoute, getRooms);
router.post("/rooms", protectRoute, createRoom); // Create a new room
router.delete("/rooms/:roomId", protectRoute, deleteRoom); // Delete a room
router.post("/rooms/add-contact", protectRoute, addContactToRoom); // Add contact to a room
router.post("/rooms/remove-contact", protectRoute, removeContactFromRoom); // Remove contact from a room
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id?", protectRoute, sendMessage);

export default router;
