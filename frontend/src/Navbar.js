import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = localStorage.getItem("admin");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user || isAdmin || user.role === "volunteer") return null;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm px-4"
      style={{
        background: "linear-gradient(90deg, #0f172a, #1e293b)",
        minHeight: "70px"
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/dashboard">
          <span className="me-2 fs-4">🚨</span>
          Women Safety
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#userNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="userNav">
          <div className="ms-auto d-flex gap-2 mt-3 mt-lg-0">
            <Link className="btn btn-outline-light" to="/profile">
              👤 Profile
            </Link>

            <button className="btn btn-danger" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}