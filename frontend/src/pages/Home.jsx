import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, UserPlus } from "lucide-react";

const Home = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #e0c3fc, #8ec5fc)", 
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="text-center p-5 rounded shadow-lg"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          className="display-4 fw-bold mb-4"
          style={{
            color: "#4a90e2",
            fontSize: "2.5rem",
          }}
        >
          Welcome to Realtime Chat App
        </h1>
        <p
          className="lead mb-5"
          style={{
            color: "#6c757d",
            fontSize: "1.2rem",
            lineHeight: "1.5",
          }}
        >
          Connect and communicate effortlessly in real time.
        </p>
        <div className="d-flex justify-content-center gap-4">
          <Link
            to="/login"
            className="btn btn-primary btn-lg d-flex align-items-center gap-2"
            style={{
              backgroundColor: "#4a90e2",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              fontWeight: "600",
              fontSize: "16px",
              textDecoration: "none",
            }}
          >
            <MessageCircle size={20} /> Login
          </Link>
          <Link
            to="/register"
            className="btn btn-secondary btn-lg d-flex align-items-center gap-2"
            style={{
              backgroundColor: "#5cb85c",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              fontWeight: "600",
              fontSize: "16px",
              color: "#ffffff",
              textDecoration: "none",
            }}
          >
            <UserPlus size={20} /> Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
