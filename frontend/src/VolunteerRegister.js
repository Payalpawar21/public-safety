import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VolunteerRegister() {
  const navigate = useNavigate();

  const API = "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const register = async () => {
    const { name, email, password, phone } = form;

    if (!name || !email || !password || !phone) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/auth/volunteer-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (
        data === "Volunteer Registered" ||
        data.message === "Volunteer Registered"
      ) {
        alert("✅ Registered Successfully");
        navigate("/");
      } else {
        alert(data.message || "Registration Failed");
      }

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
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
          maxWidth: "500px",
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
              backgroundColor: "#e8f5e9",
              fontSize: "32px"
            }}
          >
            🚑
          </div>

          <h3 className="fw-bold text-success">
            Volunteer Registration
          </h3>

          <p className="text-muted mb-0">
            Join as a verified emergency responder
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            className="form-control"
            name="name"
            placeholder="Enter Full Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
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
          <label className="form-label fw-semibold">Password</label>
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
          <label className="form-label fw-semibold">Phone Number</label>
          <input
            className="form-control"
            name="phone"
            placeholder="Enter Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <button
          className="btn btn-success w-100 py-2 fw-bold"
          onClick={register}
          disabled={loading}
          style={{ borderRadius: "12px" }}
        >
          {loading ? "Registering..." : "Register as Volunteer"}
        </button>

        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <span
            style={{
              color: "#198754",
              cursor: "pointer",
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