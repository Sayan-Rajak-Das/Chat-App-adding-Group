const users = []; 

// Add a new user
export const addUser = (id, username, room = null) => {
  const existingUser = users.find((user) => user.id === id);

  if (!existingUser) {
    const user = { id, username, room };          // Room is optional for private chats
    users.push(user);
    return user;
  }

  return existingUser;                            // If user already exists, return the existing user
};


// Get a user by socket ID
export const getUser = (id) => users.find((user) => user.id === id);
 

// Remove a user by socket ID
export const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};


// Get all users in a specific room
export const getRoomUsers = (room) => users.filter((user) => user.room === room);


// Get all online users (for sidebar or active users list)
export const getAllOnlineUsers = () => users;


// Get a user's socket ID by username (useful for 1-to-1 messaging)
export const getUserSocketId = (username) => {
  const user = users.find((user) => user.username === username);
  return user ? user.id : null; 
};
