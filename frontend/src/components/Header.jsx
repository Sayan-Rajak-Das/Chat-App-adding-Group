import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

const Header = ({ title, isOnline, onBack, onLogout, profilePic }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout(); // Call the logout function from parent
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between bg-primary text-white p-3 shadow">
      <div className="d-flex align-items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="btn btn-link text-white p-0 me-2"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {profilePic ? (
          <img
            src={profilePic}
            alt={title || "User"}
            className="rounded-circle me-3"
            style={{ width: "40px", height: "40px" }}
          />
        ) : (
          <div
            className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
            style={{ width: "40px", height: "40px" }}
          >
            <User className="text-secondary" size={20} />
          </div>
        )}
        <div>
          <p className="mb-0 fw-bold">{title}</p>
          {isOnline !== undefined && (
            <p className="mb-0 small">
              {isOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-danger btn-sm fw-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
