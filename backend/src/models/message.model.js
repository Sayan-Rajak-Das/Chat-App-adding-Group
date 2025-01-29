import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  // Sender of the message
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: function () {
        return !this.roomId;  // receiverId is required if it's not a room message
      },
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",  
      required: function () {
        return !this.receiverId;  // roomId is required if it's not a 1-to-1 message
      },
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",  
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
