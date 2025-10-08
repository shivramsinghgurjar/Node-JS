import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #e6e6e6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 700 }}>
        <Link to="/" style={{ textDecoration: "none", color: "#111" }}>
          AuthApp
        </Link>
      </div>
      <div>
        {user ? (
          <>
            <Link to="/dashboard" style={{ marginRight: 12 }}>
              Dashboard
            </Link>
            <button onClick={logoutUser}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 12 }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
