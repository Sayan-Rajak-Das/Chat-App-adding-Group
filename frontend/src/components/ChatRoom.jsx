import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import WelcomePage from "./WelcomePage";
import api from "../services/api";
import { toast } from "react-toastify";
import socket from "../services/socket.js";


const ChatRoom = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => {
        // Prevent adding the message if it's already in the state
        const isDuplicate = prevMessages.some(msg => msg._id === message._id);
        if (isDuplicate) return prevMessages;                                          // Don't add the duplicate message
        return [...prevMessages, message];    
      });
    });
  
    return () => {
      socket.off("newMessage");
    };
  }, []);

  
  useEffect(() => {
    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off("updateOnlineUsers");
    };
  }, []);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await api.get("/auth/check");
        setLoggedInUser(response.data);
        socket.emit("join", response.data._id);
      } catch (error) {
        console.error("Error fetching logged-in user:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          handleLogout();
        }
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      const fetchUsers = async () => {
        try {
          const response = await api.get("/messages/users");
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error.response?.data || error.message);
        }
      };

      fetchUsers();
    }
  }, [loggedInUser]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get("/messages/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error.response?.data || error.message);
      }
    };

    fetchRooms();
  }, [loggedInUser]);

  useEffect(() => {
    if (activeChat && loggedInUser) {
      const fetchMessages = async () => {
        try {
          const endpoint = activeChat.room
            ? `/messages/${activeChat._id}?room=true`
            : `/messages/${activeChat._id}`;
          const response = await api.get(endpoint);
          setMessages(response.data);

          if (activeChat.room) {
            socket.emit("joinRoom", activeChat._id);
          }
        } catch (error) {
          console.error("Error fetching messages:", error.response?.data || error.message);
        }
      };

      fetchMessages();
    }
  }, [activeChat, loggedInUser]);

  const handleSendMessage = async (text, image) => {
    try {
      const body = { text, image };
      if (activeChat.room) {
        body.room = activeChat._id;
      }

      const response = await api.post(`/messages/send/${activeChat._id}`, body);

      if (!activeChat.room) {
        // Only add locally for 1-to-1 chats, as room messages are handled by Socket.IO
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...response.data, senderId: { ...loggedInUser } },
        ]);
      }

      socket.emit("sendMessage", {
        ...response.data,
        receiverId: activeChat._id,
      });
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      toast.error("Failed to send the message. Please try again.");
    }
  };

  const addRoom = async (roomName) => {
    try {
      const response = await api.post("/messages/rooms", { roomName });
      setRooms((prevRooms) => [...prevRooms, response.data.room]);
      toast.success("Room created successfully!");
    } catch (error) {
      console.error("Error creating room:", error.response?.data || error.message);
      if (error.response?.status === 400) {
        toast.error("Room creation failed. Room name might already exist.");
      } else {
        toast.error("An error occurred while creating the room.");
      }
    }
  };

  const deleteRoom = async (roomId) => {
    console.log("Deleting room with ID:", roomId);

    try {
      await api.delete(`/messages/rooms/${roomId}`);
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      toast.success("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error.response?.data || error.message);
      toast.error("Failed to delete the room. Please try again.");
    }
  };

  const addContactToRoom = async (roomId, userId) => {
    try {
      await api.post("/messages/rooms/add-contact", { roomId, userId });
      toast.success("Contact added to room successfully!");
    } catch (error) {
      console.error("Error adding contact to room:", error.response?.data || error.message);
      toast.error("Failed to add the contact to the room.");
    }
  };

  const removeContactFromRoom = async (roomId, userId) => {
    try {
      await api.post("/messages/rooms/remove-contact", { roomId, userId });
      toast.success("Contact removed from room successfully!");
    } catch (error) {
      console.error("Error removing contact from room:", error.response?.data || error.message);
      toast.error("Failed to remove the contact from the room.");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      localStorage.clear();
      socket.disconnect();
      toast.success("Logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error.response?.data || error.message);
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    if (window.innerWidth < 768) {
      setIsSidebarVisible(false);
    }
  };

  const handleBack = () => {
    setActiveChat(null);
    if (window.innerWidth < 768) {
      setIsSidebarVisible(true);
    }
  };

  return (
    <div className="d-flex vh-100">
      {isSidebarVisible && (
        <div
          className="d-flex flex-column"
          style={{
            width: window.innerWidth >= 768 ? "280px" : "100%",
            borderRight: window.innerWidth >= 768 ? "2px solid #e0e0e0" : "none",
            backgroundColor: "#f8f9fa",
            overflow: "hidden",
          }}
        >
          <Sidebar
            users={users}
            onlineUsers={onlineUsers}
            rooms={rooms}
            onSelectChat={handleSelectChat}
            addRoom={addRoom}
            deleteRoom={deleteRoom}
            addContactToRoom={addContactToRoom}
            removeContactFromRoom={removeContactFromRoom}
          />
        </div>
      )}

      <div className="flex-grow-1 d-flex flex-column">
        {activeChat ? (
          <>
            <Header
              title={activeChat?.room || activeChat?.name || activeChat?.fullName || "Chat"}
              isOnline={onlineUsers.includes(activeChat?._id)}
              onBack={handleBack}
              onLogout={handleLogout}
              profilePic={activeChat?.profilePic}
            />
            <div id="chat-messages" className="flex-grow-1 overflow-auto px-3 bg-light">
              <MessageList messages={messages} loggedInUserId={loggedInUser?._id} />
            </div>
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : window.innerWidth >= 768 ? (
          <WelcomePage />
        ) : (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center"
            style={{background: "linear-gradient(135deg, #4facfe, #00f2fe)",}}
          >
            <p className="text-muted">Select a chat to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
