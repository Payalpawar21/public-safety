import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function VolunteerNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user || user.role !== "volunteer") return null;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm px-4"
      style={{
        background: "linear-gradient(90deg, #14532d, #166534)",
        minHeight: "70px"
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          to="/volunteer"
        >
          <span className="me-2 fs-4">🚑</span>
          Volunteer Panel
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#volunteerNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="volunteerNav">
          <div className="ms-auto d-flex gap-2 mt-3 mt-lg-0">
            

            <button className="btn btn-danger" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}