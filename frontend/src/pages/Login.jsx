import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("userId", response.data._id); // Save the logged-in user ID
      localStorage.setItem("userName", response.data.fullName); // Optional: Save name
      toast.success("Login successful!");
      navigate("/chat"); // Navigate to the chat screen
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    handleLogin({ email, password });
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #74ebd5, #9face6)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="col-10 col-md-6 col-lg-4 p-5 rounded shadow-lg"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{ color: "#6a1b9a", fontWeight: "700" }}
        >
          Welcome Back!
        </h2>
        <p className="text-center mb-4 text-muted">
          Please login to continue.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px",
              }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              backgroundColor: "#6a1b9a",
              borderColor: "#6a1b9a",
              borderRadius: "8px",
              fontWeight: "600",
              padding: "12px",
              fontSize: "16px",
            }}
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <span
              style={{
                color: "#6a1b9a",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: "600",
              }}
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
