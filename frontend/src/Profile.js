import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [contacts, setContacts] = useState(
    user?.emergencyContacts || []
  );

  const API = "http://localhost:5000";

  const handlePhoto = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2000000) {
      alert("Image too large (Max 2MB)");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const addContact = () => {
    setContacts([...contacts, { name: "", phone: "" }]);
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const removeContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(`${API}/api/auth/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          phone,
          photo,
          emergencyContacts: contacts
        })
      });

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data));

      alert("✅ Profile Updated Successfully");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div
        className="card shadow-lg border-0"
        style={{ borderRadius: "18px" }}
      >
        <div className="card-body p-4">
          <h3 className="fw-bold mb-4 text-primary">
            👤 My Safety Profile
          </h3>

          {/* Profile Photo */}
          <div className="text-center mb-4">
            <img
              src={photo || "https://via.placeholder.com/120"}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "4px solid #0d6efd"
              }}
            />

            <input
              type="file"
              className="form-control mt-3"
              onChange={handlePhoto}
            />
          </div>

          {/* User Info */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Full Name
              </label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Full Name"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Phone Number
              </label>
              <input
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter Phone Number"
              />
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-danger mb-0">
                🚨 Emergency Contacts
              </h5>

              <button
                className="btn btn-success btn-sm"
                onClick={addContact}
              >
                ➕ Add Contact
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="alert alert-light border">
                No emergency contacts added yet.
              </div>
            ) : (
              contacts.map((c, i) => (
                <div
                  key={i}
                  className="card mb-3 border-0 shadow-sm"
                >
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-5 mb-2">
                        <input
                          className="form-control"
                          placeholder="Contact Name"
                          value={c.name}
                          onChange={(e) =>
                            updateContact(i, "name", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-5 mb-2">
                        <input
                          className="form-control"
                          placeholder="Phone Number"
                          value={c.phone}
                          onChange={(e) =>
                            updateContact(i, "phone", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-md-2 mb-2">
                        <button
                          className="btn btn-outline-danger w-100"
                          onClick={() => removeContact(i)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          <button
            className="btn btn-primary w-100 mt-4 py-2 fw-bold"
            onClick={saveProfile}
            style={{ borderRadius: "12px" }}
          >
            💾 Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}