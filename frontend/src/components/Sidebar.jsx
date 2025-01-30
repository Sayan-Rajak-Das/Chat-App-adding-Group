import React, { useState } from "react";
import { User, Plus, Trash2, Users } from "lucide-react";

const Sidebar = ({
  users = [],
  onlineUsers = [],
  rooms = [],
  addRoom = () => console.warn("addRoom function not provided"),
  deleteRoom = () => console.warn("deleteRoom function not provided"),
  onSelectChat = () => console.warn("onSelectChat function not provided"),
  addContactToRoom = () => console.warn("addContactToRoom function not provided"),
  removeContactFromRoom = () => console.warn("removeContactFromRoom function not provided"),
}) => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showRooms, setShowRooms] = useState(false); // Initially show Users section
  const [newRoom, setNewRoom] = useState(""); // For creating a new room
  const [selectedRoom, setSelectedRoom] = useState(""); // For managing room contacts
  const [selectedUser, setSelectedUser] = useState(""); // For adding/removing a contact

  const loggedInUserId = localStorage.getItem("userId");

  // Filter users based on online status and exclude the logged-in user
  const filteredUsers = users.filter(
    (user) =>
      user._id !== loggedInUserId &&
      (!showOnlineOnly || onlineUsers.includes(user._id))
  );

  // Create a new room
  const handleCreateRoom = async () => {
    if (newRoom.trim()) {
      try {
        await addRoom(newRoom); // Call parent function
        setNewRoom(""); // Reset input
      } catch (error) {
        console.error("Error creating room:", error.message);
      }
    }
  };

  // Add a contact to the selected room
  const handleAddContact = async () => {
    if (selectedRoom && selectedUser) {
      try {
        await addContactToRoom(selectedRoom._id, selectedUser);
        setSelectedUser(""); // Reset user selection after adding
      } catch (error) {
        console.error("Error adding contact to room:", error.message);
      }
    }
  };

  // Remove a contact from the selected room
  const handleRemoveContact = async () => {
    if (selectedRoom && selectedUser) {
      try {
        await removeContactFromRoom(selectedRoom._id, selectedUser);
        setSelectedUser(""); // Reset user selection after removing
      } catch (error) {
        console.error("Error removing contact from room:", error.message);
      }
    }
  };

  return (
    <div
      className="d-flex flex-column h-100"
      // style={{
      //   minWidth: "260px",
      //   maxWidth: "300px",
      //   backgroundColor: "#1f2937", 
      //   color: "#e5e7eb", 
      //   borderRight: "1px solid #3b82f6",
      //   boxShadow: "3px 0 10px rgba(0, 0, 0, 0.3)", 
      //   borderRadius: "0 10px 10px 0", 
      //   overflow: "hidden",
      // }}

      style={{
        minWidth: "260px",
        maxWidth: "300px",
        background: "linear-gradient(135deg, #e0e7ff, #cfd8dc)", // Subtle blue-gray gradient
        color: "#1e293b", // Dark gray-blue text for a formal look
        borderRight: "6px solid transparent", // Base border setup
        backgroundClip: "padding-box", // Ensures the gradient stays on the outside
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.1)", // Slightly enhanced shadow for depth
        borderImage: "linear-gradient(135deg, #3b82f6, #1d4ed8) 1", // Gradient border effect
        borderRadius: "0 6px 6px 0", // Sharper and balanced corners
        overflow: "hidden", // Prevent overflow issues
      }}     
    >
      {/* Toggle between Rooms and Users */}
      <div
        className="p-3 border-bottom d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: "#00aaff", // Accent color
          color: "#ffffff", // White text for header
        }}
      >
        <h2 className="h5 mb-0">{showRooms ? "Rooms" : "Users"}</h2>
        <button
          className="btn btn-sm btn-light"
          onClick={() => setShowRooms((prev) => !prev)}
        >
          {showRooms ? "Show Users" : "Show Rooms"}
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto p-3">
        {showRooms ? (
          <div>
            {/* Rooms Section */}
            <ul className="list-unstyled mb-4">
              {rooms.length > 0 ? (
                rooms.map((room, index) => (
                  <li
                    key={index}
                    className="mb-3 d-flex align-items-center justify-content-between rounded p-2"
                    style={{
                      backgroundColor: "#ffffff", // White background for room item
                      color: "#282c34", // Dark text
                      cursor: "pointer",
                    }}
                  >
                    <div
                      onClick={() => onSelectChat({ ...room, room: room.name })}
                      className="d-flex align-items-center flex-grow-1"
                    >
                      <Users className="text-secondary me-2" />
                      <span>{room.name}</span>
                    </div>
                    <button
                      onClick={() => deleteRoom(room._id)}
                      className="btn btn-sm btn-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-light text-center">No rooms found</p>
              )}
            </ul>

            {/* Create Room */}
            <div className="input-group">
              <input
                type="text"
                value={newRoom}
                placeholder="Create a new room"
                className="form-control"
                onChange={(e) => setNewRoom(e.target.value)}
              />
              <button
                onClick={handleCreateRoom}
                className="btn btn-success"
                title="Create Room"
              >
                <Plus />
              </button>
            </div>

            {/* Manage Room Contacts */}
            <h2 className="h6 mt-4 text-light">Manage Room Contacts</h2>
            <div className="mb-2">
              <select
                value={selectedRoom?._id || ""}
                onChange={(e) => {
                  const selected = rooms.find(room => room._id === e.target.value);
                  setSelectedRoom(selected);
                }}
                className="form-select mb-2"
              >
                <option value="">Select a room</option>
                {rooms.map((room, index) => (
                  <option key={index} value={room._id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="form-select mb-2"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
              <div className="d-flex gap-2">
                <button
                  onClick={handleAddContact}
                  className="btn btn-success flex-grow-1"
                >
                  Add Contact
                </button>
                <button
                  onClick={handleRemoveContact}
                  className="btn btn-warning flex-grow-1"
                >
                  Remove Contact
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Users Section */}
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="onlineOnly"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="onlineOnly">
                Online Only
              </label>
            </div>
            <ul className="list-unstyled">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => onSelectChat(user)}
                    className="d-flex align-items-center mb-3 p-2 rounded"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#282c34",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="d-flex align-items-center me-3">
                      <div
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.fullName || "User"}
                            className="rounded-circle"
                            style={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <User className="text-light" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="mb-0 fw-bold">{user.fullName || "Unknown User"}</p>
                      <small className="text-muted">
                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                      </small>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-light text-center">No users found</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
