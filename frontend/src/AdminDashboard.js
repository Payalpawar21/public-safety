import React, { useEffect, useState, useRef } from "react";

import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io("http://localhost:5000");

export default function AdminDashboard() {
  const [alerts, setAlerts] = useState([]);
  const audioRef = useRef(null);

  const API = "http://localhost:5000";

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
      window.location.href = "/";
      return;
    }

    fetchAlerts();

    audioRef.current = new Audio("/alert.mp3");

    const unlockAudio = () => {
      audioRef.current.play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        })
        .catch(() => {});

      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);

    socket.on("newAlert", (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    });

    return () => {
      socket.off("newAlert");
      document.removeEventListener("click", unlockAudio);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API}/api/alerts`);
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
     

      <div className="container mt-4">
        {/* Audio Notice */}
        <div className="alert alert-warning text-center shadow-sm">
          🔊 Click anywhere once to enable emergency alert sound
        </div>

        {/* Stats */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-lg bg-danger text-white">
              <div className="card-body">
                <h6>Total Emergency Alerts</h6>
                <h2 className="fw-bold">{alerts.length}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-lg bg-success text-white">
              <div className="card-body">
                <h6>Resolved Alerts</h6>
                <h2 className="fw-bold">
                  {alerts.filter(a => a.status === "completed").length}
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-lg bg-warning text-dark">
              <div className="card-body">
                <h6>Pending Alerts</h6>
                <h2 className="fw-bold">
                  {alerts.filter(a => a.status !== "completed").length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Table */}
        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body">
            <h4 className="fw-bold mb-3">🚨 Recent Emergency Alerts</h4>

            {alerts.length === 0 ? (
              <p className="text-center text-muted">No Alerts Found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>WhatsApp</th>
                      <th>Call</th>
                    </tr>
                  </thead>

                  <tbody>
                    {alerts.map((a, i) => (
                      <tr key={a._id}>
                        <td>{i + 1}</td>

                        <td>{a.userId?.name || "N/A"}</td>

                        <td>{a.userId?.phone || "N/A"}</td>

                        <td>
                          <a
                            href={a.location}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-primary btn-sm"
                          >
                            View Map
                          </a>
                        </td>

                        <td>
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
                        </td>

                        <td>
                          {a.time
                            ? new Date(a.time).toLocaleString()
                            : "N/A"}
                        </td>

                        <td>
                          <a
                            href={`https://wa.me/${a.userId?.phone}?text=🚨 Emergency Alert! Please respond immediately.`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-success btn-sm"
                          >
                            WhatsApp
                          </a>
                        </td>

                        <td>
                          <a
                            href={`tel:${a.userId?.phone}`}
                            className="btn btn-primary btn-sm"
                          >
                            Call
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Live Maps */}
        <div className="card shadow-lg border-0">
          <div className="card-body">
            <h4 className="fw-bold mb-3">🗺️ Live Alert Locations</h4>

            <div className="row">
              {alerts.map((a) => {
                const coords = a.location?.split("?q=")[1];

                if (!coords) return null;

                return (
                  <div className="col-md-6 mb-4" key={a._id}>
                    <div className="card shadow-sm border-0">
                      <div className="card-body">
                        <h6>{a.userId?.name}</h6>

                        <iframe
                          width="100%"
                          height="250"
                          style={{
                            border: 0,
                            borderRadius: "12px"
                          }}
                          src={`https://www.google.com/maps?q=${coords}&output=embed`}
                          title={`map-${a._id}`}
                        ></iframe>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
