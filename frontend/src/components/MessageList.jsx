import React from "react";
import { User } from "lucide-react";

const MessageList = ({ messages, loggedInUserId }) => {
  return (
    <div
      className="flex-grow-1 overflow-auto p-3 bg-white"
      style={{ paddingBottom: "80px" }} // Ensure the last message is not hidden by the input bar
    >
      {messages.map((message, index) => {
        const isLoggedInUser = message.senderId?._id === loggedInUserId;

        return (
          <div
            key={`${message._id}-${index}`} // Ensure unique keys
            className={`d-flex mb-3 ${
              isLoggedInUser ? "justify-content-end" : "justify-content-start"
            }`}
          >
            {/* Profile Picture for Other Users */}
            {!isLoggedInUser && message.senderId && (
              <div className="me-2">
                {message.senderId.profilePic ? (
                  <img
                    src={message.senderId.profilePic}
                    alt={message.senderId.fullName || "User"}
                    className="rounded-circle shadow-sm"
                    style={{ width: "40px", height: "40px" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <User className="text-light" size={20} />
                  </div>
                )}
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`p-2 rounded shadow-sm ${
                isLoggedInUser
                  ? "bg-primary text-white text-end"
                  : "bg-light text-dark text-start"
              }`}
              style={{ maxWidth: "75%" }}
            >
              {message.text}
            </div>

            {/* Profile Picture for Logged-In User */}
            {isLoggedInUser && (
              <div className="ms-2">
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: "40px", height: "40px" }}
                >
                  <User className="text-light" size={20} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
