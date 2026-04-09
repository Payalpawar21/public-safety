import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm px-4"
      style={{
        background: "linear-gradient(90deg, #111827, #1f2937)",
        minHeight: "70px"
      }}
    >
      <div className="container-fluid">
        {/* Brand */}
        <div className="d-flex align-items-center">
          <div
            className="me-3 d-flex align-items-center justify-content-center"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              backgroundColor: "#dc3545",
              fontSize: "22px"
            }}
          >
            👮
          </div>

          <div>
            <h5 className="text-white mb-0 fw-bold">
              Admin Control Panel
            </h5>
            <small className="text-light opacity-75">
              Women Safety Monitoring System
            </small>
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn btn-danger px-4 py-2 fw-semibold"
          style={{
            borderRadius: "12px"
          }}
          onClick={logout}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}