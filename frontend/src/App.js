import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import VolunteerDashboard from "./VolunteerDashboard";
import VolunteerRegister from "./VolunteerRegister";



function Layout() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = localStorage.getItem("admin");

  return (
    <>
      {/* 🔥 Navbar logic */}
      {user && !isAdmin && location.pathname !== "/" && location.pathname !== "/register" && (
        <Navbar />
      )}

      {isAdmin && <AdminNavbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/volunteer-register" element={<VolunteerRegister />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;