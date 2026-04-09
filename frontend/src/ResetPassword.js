import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  const reset = async () => {
    if (!password.trim()) {
      alert("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ password })
        }
      );

      const data = await res.json();

      alert(data.message || "Password Updated");

      if (
        data.message &&
        data.message.toLowerCase().includes("success")
      ) {
        navigate("/");
      }

    } catch (err) {
      console.log(err);
      alert("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "18px"
        }}
      >
        <div className="text-center mb-4">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "#e8f5e9",
              fontSize: "30px"
            }}
          >
            🔁
          </div>

          <h3 className="fw-bold">Reset Password</h3>

          <p className="text-muted mb-0">
            Enter your new secure password below
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            New Password
          </label>

          <input
            type="password"
            className="form-control"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && reset()}
          />
        </div>

        <button
          className="btn btn-success w-100 py-2 fw-bold"
          onClick={reset}
          disabled={loading}
          style={{ borderRadius: "12px" }}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}