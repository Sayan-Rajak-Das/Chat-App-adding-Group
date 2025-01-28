import React from "react";
import { MessageSquare, Users, CheckCircle, LayoutDashboard, User } from "lucide-react";

const WelcomePage = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        height: "100vh",
        padding: "20px",
        background: "linear-gradient(135deg, #4facfe, #00f2fe)",
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1
        className="display-4 fw-bold"
        style={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        Welcome to Chat App
      </h1>
      <p className="lead mt-3" style={{ fontSize: "1.2rem" }}>
        Stay connected with friends, family, and colleagues in real-time.
      </p>
      <div
        className="d-flex flex-column align-items-center p-4 mt-4 rounded shadow"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          width: "80%",
          maxWidth: "600px",
          backdropFilter: "blur(10px)",
          borderRadius: "10px",
        }}
      >
        <h2 className="h5 fw-bold mb-3">Features:</h2>
        <ul className="list-unstyled mt-3 text-start">
          <li className="d-flex align-items-center mb-2">
            <CheckCircle size={20} className="me-2 text-success" />
            Create and manage chat rooms
          </li>
          <li className="d-flex align-items-center mb-2">
            <Users size={20} className="me-2 text-warning" />
            Add or remove participants
          </li>
          <li className="d-flex align-items-center mb-2">
            <MessageSquare size={20} className="me-2 text-info" />
            Real-time messaging
          </li>
          <li className="d-flex align-items-center mb-2">
            <User size={20} className="me-2 text-primary" />
            Online status indicators
          </li>
          <li className="d-flex align-items-center mb-2">
            <LayoutDashboard size={20} className="me-2 text-secondary" />
            Seamless UI for easy navigation
          </li>
        </ul>
        <p className="mt-3" style={{ fontSize: "1rem" }}>
          To get started, select a user or room from the sidebar!
        </p>
      </div>
      <footer className="mt-auto" style={{ marginTop: "20px", fontSize: "0.9rem" }}>
        <span style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)" }}>
          © 2025 Chat App - Built for real-time collaboration
        </span>
      </footer>
    </div>
  );
};

export default WelcomePage;
