import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 IMPORTANT (mobile API fix)
  const API = "http://localhost:5000";

  // 👨‍👩‍👧 Multiple contacts
  const contacts =
  user?.emergencyContacts && user.emergencyContacts.length > 0
    ? user.emergencyContacts
    : [];

  // 🔐 Protect route
  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    }
  }, [user]);

  // 📍 Get Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLoading(false);
      },
      (err) => {
        console.log("Location Error:", err);
        setLoading(false);
      }
    );
  }, []);

  // 🚨 SOS
  const sendSOS = async () => {
    if (!lat || !lng) {
      alert("Location not available");
      return;
    }

    const location = `https://maps.google.com/?q=${lat},${lng}`;

    try {
      await fetch(`${API}/api/alerts/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?._id,
          location
        })
      });

      alert("🚨 SOS Sent Successfully!");
    } catch (err) {
      console.log(err);
      alert("Error sending SOS");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="container mt-4">

      {/* 🔝 Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>👋 Welcome, {user?.name}</h4>

       
      </div>

      {/* 📍 Location */}
      <div className="card shadow p-3 mb-4">
        <h5 className="mb-3">📍 Your Live Location</h5>

        {loading ? (
          <p>Loading location...</p>
        ) : lat && lng ? (
          <iframe
            title="map"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: "10px" }}
            src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
          ></iframe>
        ) : (
          <p>Location not available</p>
        )}
      </div>

      {/* 🚨 SOS */}
      <div className="card shadow p-4 text-center mb-4">

        <h5 className="mb-3">🚨 Emergency Actions</h5>

        <button
          className="btn btn-danger btn-lg px-5 py-3 mb-3"
          style={{
            borderRadius: "50px",
            fontSize: "20px",
            boxShadow: "0 0 20px red"
          }}
          onClick={sendSOS}
        >
          🚨 SEND SOS
        </button>

      </div>

      {/* 📞 CONTACT LIST */}
      <div className="card shadow p-4">

        <h5 className="mb-3">📞 Emergency Contacts</h5>

        {contacts.length === 0 && (
          <p className="text-muted">No contacts added</p>
        )}

        {contacts.map((c, i) => (
          <div
            key={i}
            className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded"
          >
            <div>
              <strong>{c.name}</strong><br/>
              <small>{c.phone}</small>
            </div>

            <div className="d-flex gap-2">

              {/* 📞 Call */}
              <a
                href={`tel:${c.phone}`}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: "20px" }}
              >
                📞
              </a>

              {/* 💬 WhatsApp */}
              <a
                href={
                  lat && lng
                    ? `https://wa.me/${c.phone}?text=${encodeURIComponent(
                        `🚨 Help! My location: https://maps.google.com/?q=${lat},${lng}`
                      )}`
                    : "#"
                }
                onClick={(e) => {
                  if (!lat || !lng) {
                    e.preventDefault();
                    alert("Location not ready");
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="btn btn-success btn-sm"
                style={{ borderRadius: "20px" }}
              >
                💬
              </a>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
