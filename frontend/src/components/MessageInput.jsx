import React, { useState, useEffect } from "react";
import { Smile } from "lucide-react";

const MessageInput = ({ onSendMessage, onTyping, onStopTyping }) => {
  const [text, setText] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showStickers, setShowStickers] = useState(false); 

  // Dummy stickers for demonstration
  const stickers = ["😀", "😂", "😍", "👍", "🎉"];

  // Listen to screen resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text, null);                  // Pass text to the parent component
      setText("");
      onStopTyping();                             // Stop typing once the message is sent
    }
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim()) {
      onTyping();                                 // Trigger typing event
    } else {
      onStopTyping();                             // Trigger stop typing event
    }
  };

  const handleStickerClick = () => {
    setShowStickers((prev) => !prev);             // Toggle sticker picker visibility
  };

  const handleSelectSticker = (sticker) => {
    setText((prev) => prev + sticker);            // Append sticker to input field
    setShowStickers(false);                       // Hide sticker picker
  };

  return (
    <div>
      {/* Sticker Picker */}
      {showStickers && (
        <div
          className="sticker-picker"
          style={{
            position: "absolute",
            bottom: "70px",
            left: "10px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 100,
            display: "flex",
            gap: "10px",
          }}
        >
          {stickers.map((sticker, index) => (
            <span
              key={index}
              onClick={() => handleSelectSticker(sticker)}
              style={{
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              {sticker}
            </span>
          ))}
        </div>
      )}

      {/* Input Section */}
      <form
        onSubmit={handleSend}
        className="d-flex align-items-center p-3"
        style={{
          backgroundColor: "#f8fafc",
          borderTop: "2px solid #e5e7eb", 
          boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.05)", 
          position: "sticky",
          bottom: 0,
          zIndex: 10,
        }}
      >
        {/* Sticker Button */}
        <button
          type="button"
          onClick={handleStickerClick} 
          className="btn btn-light d-flex align-items-center justify-content-center me-2"
          style={{
            borderRadius: "50%", 
            width: "45px",
            height: "45px",
            padding: 0,
            fontSize: "18px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", 
          }}
        >
          <Smile size={24} color="#3b82f6" /> 
        </button>

        {/* Input Field */}
        <input
          type="text"
          className="form-control me-3"
          style={{
            flexGrow: 1,
            border: "2px solid #e5e7eb", 
            borderRadius: "20px",
            padding: "10px 15px",
            fontSize: "16px", 
            outline: "none",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)", 
          }}
          placeholder="Type a message..."
          value={text}
          onChange={handleInputChange}
          onBlur={onStopTyping} // Ensure typing stops when input loses focus
        />

        {/* Send Button */}
        <button
          type="submit"
          className="btn btn-primary d-flex align-items-center justify-content-center"
          style={{
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            padding: 0,
            fontSize: "18px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", 
          }}
        >
          📤
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
