import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,  // Ensure room names are unique
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Users who belong to the room
        required: true,
      },
    ]
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
