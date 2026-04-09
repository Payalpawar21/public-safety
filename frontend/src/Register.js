import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const navigate = useNavigate();

  const API = "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const validate = () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.phone
    ) {
      return "All fields are required";
    }

    if (form.phone.length !== 10) {
      return "Phone number must be 10 digits";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const register = async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (
        data === "User Registered" ||
        data.message === "User Registered"
      ) {
        alert("✅ Registration Successful");
        navigate("/");
      } else {
        setError(data.message || data || "Registration Failed");
      }

    } catch (err) {
      console.log(err);
      setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a, #1e293b)"
      }}
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
              width: "75px",
              height: "75px",
              borderRadius: "50%",
              backgroundColor: "#e7f1ff",
              fontSize: "32px"
            }}
          >
            📝
          </div>

          <h3 className="fw-bold">Create Account</h3>

          <p className="text-muted mb-0">
            Register to access the Women Safety Platform
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Full Name
          </label>
          <input
            className="form-control"
            name="name"
            placeholder="Enter Full Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="Enter Email Address"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">
            Phone Number
          </label>
          <input
            className="form-control"
            name="phone"
            placeholder="Enter Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <button
          className="btn btn-primary w-100 py-2 fw-bold"
          onClick={register}
          disabled={loading}
          style={{ borderRadius: "12px" }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <span
            style={{
              cursor: "pointer",
              color: "#0d6efd",
              fontWeight: "600"
            }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}