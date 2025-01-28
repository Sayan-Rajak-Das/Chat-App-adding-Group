import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="bg-base-200 min-h-screen">
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
