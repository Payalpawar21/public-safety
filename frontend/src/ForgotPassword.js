import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  const sendLink = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.toLowerCase()
        })
      });

      const data = await res.json();

      alert(data.message || "Reset link sent successfully");

    } catch (err) {
      console.log(err);
      alert("Failed to send reset link");
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
              backgroundColor: "#e7f1ff",
              fontSize: "30px"
            }}
          >
            🔐
          </div>

          <h3 className="fw-bold">Forgot Password?</h3>

          <p className="text-muted mb-0">
            Enter your registered email to receive a reset link
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Email Address
          </label>

          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendLink()}
          />
        </div>

        <button
          className="btn btn-primary w-100 py-2 fw-bold"
          onClick={sendLink}
          disabled={loading}
          style={{ borderRadius: "12px" }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}