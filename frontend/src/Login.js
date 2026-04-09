import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API = "http://localhost:5000";

  const login = async () => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password
        })
      });

      const data = await res.json();

      console.log("Login Response:", data);

      if (!data.user) {
        alert(data.message || data || "Login Failed");
        return;
      }

      // Clear previous role flags
      localStorage.removeItem("admin");

      // Save logged in user
      localStorage.setItem("user", JSON.stringify(data.user));

      // Role-based redirect
      if (data.user.role === "admin") {
        localStorage.setItem("admin", "true");
        navigate("/admin-dashboard");

      } else if (data.user.role === "volunteer") {
        navigate("/volunteer");

      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.log("Login Error:", err);
      alert("Login Failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h2 className="text-center mb-4">🔐 Login</h2>

        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
        />

        <button
          className="btn btn-primary w-100"
          style={{ borderRadius: "25px" }}
          onClick={login}
        >
          Login
        </button>

        <p className="text-center mt-3">
          New user?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

        <p className="text-center mt-2">
          <span
            style={{ cursor: "pointer", color: "green" }}
            onClick={() => navigate("/volunteer-register")}
          >
            Become a Volunteer 🚑
          </span>
        </p>

        <p className="text-center mt-2">
          <span
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>
      </div>
    </div>
  );
}