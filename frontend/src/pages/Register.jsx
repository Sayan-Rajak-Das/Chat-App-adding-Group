import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/signup", {
        email,
        fullName,
        password,
      });
      toast.success("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      // Extract and display specific backend error message
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Backend error message
      } else {
        toast.error("Something went wrong! Please try again.");
      }
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #74ebd5, #9face6)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <form
        className="p-5 rounded shadow-lg col-10 col-md-6 col-lg-4"
        onSubmit={handleSubmit}
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
          Create an Account
        </h2>
        <p className="text-center mb-4 text-muted">
          Connect with friends and chat in real-time!
        </p>
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
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            className="form-control"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
          Register
        </button>
        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <span
              style={{
                color: "#6a1b9a",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: "600",
              }}
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
