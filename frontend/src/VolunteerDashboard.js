import React, { useEffect, useState } from "react";
import VolunteerNavbar from "./VolunteerNavbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VolunteerDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const API = "http://localhost:5000";

  useEffect(() => {
    if (!user || user.role !== "volunteer") {
      window.location.href = "/";
      return;
    }

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API}/api/volunteer/alerts`);
      const data = await res.json();

      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const acceptAlert = async (id) => {
    try {
      await fetch(`${API}/api/volunteer/accept/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          volunteerId: user._id
        })
      });

      alert("✅ Alert Accepted");
      fetchAlerts();
    } catch (err) {
      console.log(err);
    }
  };

  const completeAlert = async (id) => {
    const confirmComplete = window.confirm(
      "Mark this emergency as completed?"
    );

    if (!confirmComplete) return;

    try {
      await fetch(`${API}/api/volunteer/complete/${id}`, {
        method: "POST"
      });

      alert("✅ Alert Completed");
      fetchAlerts();
    } catch (err) {
      console.log(err);
    }
  };

  const acceptedCount = alerts.filter(
    (a) => a.status === "accepted"
  ).length;

  const completedCount = alerts.filter(
    (a) => a.status === "completed"
  ).length;

  return (
    <>
      <VolunteerNavbar />

      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1">
              🚑 Volunteer Dashboard
            </h2>
            <small className="text-muted">
              Manage emergency assistance requests
            </small>
          </div>

          <span className="badge bg-success fs-6 px-3 py-2">
            {user?.name}
          </span>
        </div>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow bg-danger text-white">
              <div className="card-body">
                <h6>Pending Alerts</h6>
                <h2>{alerts.length}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow bg-primary text-white">
              <div className="card-body">
                <h6>Accepted Alerts</h6>
                <h2>{acceptedCount}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card border-0 shadow bg-success text-white">
              <div className="card-body">
                <h6>Completed Alerts</h6>
                <h2>{completedCount}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-success"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="alert alert-success text-center shadow-sm">
            🎉 No Emergency Alerts Right Now
          </div>
        ) : (
          <div className="row">
            {alerts.map((a) => {
              const coords = a.location?.split("?q=")[1];

              return (
                <div className="col-lg-6 mb-4" key={a._id}>
                  <div
                    className="card border-0 shadow-lg h-100"
                    style={{ borderRadius: "18px" }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <h5 className="fw-bold text-danger">
                          🚨 Emergency Alert
                        </h5>

                        <span
                          className={`badge ${
                            a.status === "completed"
                              ? "bg-success"
                              : a.status === "accepted"
                              ? "bg-primary"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {a.status || "pending"}
                        </span>
                      </div>

                      <p>
                        <strong>User:</strong>{" "}
                        {a.userId?.name || "N/A"}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {a.userId?.phone || "N/A"}
                      </p>

                      <p>
                        <strong>Location:</strong>{" "}
                        <a
                          href={a.location}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open in Google Maps
                        </a>
                      </p>

                      {coords && (
                        <iframe
                          width="100%"
                          height="220"
                          style={{
                            border: 0,
                            borderRadius: "12px"
                          }}
                          src={`https://www.google.com/maps?q=${coords}&output=embed`}
                          title={a._id}
                          className="mb-3"
                        ></iframe>
                      )}

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success flex-fill"
                          disabled={a.status === "accepted"}
                          onClick={() => acceptAlert(a._id)}
                        >
                          Accept
                        </button>

                        <button
                          className="btn btn-warning flex-fill"
                          disabled={a.status === "completed"}
                          onClick={() => completeAlert(a._id)}
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}