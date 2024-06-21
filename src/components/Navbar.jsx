import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './Navbar.css'; 

export default function Navbar() {
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="https://img.icons8.com/?size=100&id=ekfhFWx8X7C3&format=png&color=000000" alt="Logo" />
        </div>
        <div className="navbar-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Dashboard
          </NavLink>
          {userRole === 'Admin' && (
            <NavLink
              to="/user"
              className={({ isActive }) =>
                isActive
                  ? "navbar-link active"
                  : "navbar-link"
              }
            >
              Users
            </NavLink>
          )}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            Profile
          </NavLink>
          <button className="navbar-link logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
