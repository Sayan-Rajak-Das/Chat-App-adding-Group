import { create } from "zustand";

const useChatStore = create((set) => ({
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  activeRoom: null,

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setOnlineUsers: (users) => set(() => ({ onlineUsers: users })),
  setTypingUsers: (users) => set(() => ({ typingUsers: users })),
  setActiveRoom: (room) => set(() => ({ activeRoom: room })),
}));

export default useChatStore;
