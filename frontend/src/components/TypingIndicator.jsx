import React from "react";

const TypingIndicator = ({ users }) => {
  if (users.length === 0) return null; // Don't render if no one is typing

  return (
    <div
      className="p-2 border-top bg-light text-secondary small d-flex align-items-center justify-content-start"
      style={{
        fontStyle: "italic",
        letterSpacing: "0.5px",
      }}
    >
      {users.length === 1 ? (
        <p className="mb-0">
          <span className="fw-bold text-primary">{users[0]}</span> is typing...
        </p>
      ) : (
        <p className="mb-0">
          <span className="fw-bold text-primary">{users.join(", ")}</span> are typing...
        </p>
      )}
    </div>
  );
};

export default TypingIndicator;
